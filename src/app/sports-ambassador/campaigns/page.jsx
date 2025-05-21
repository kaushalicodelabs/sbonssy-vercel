"use client";
import CampaignList from "@/components/campaign/CampaignList";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

/**
 * Main container component for displaying campaigns, joined campaigns, invitations, and favorite campaigns.
 * Manages state and fetches data for sports ambassadors using a single state object.
 * @returns {JSX.Element} The Campaigns component
 */
const Campaigns = () => {
  /** @type {{ campaigns: Array, joinedCampaigns: Array, invitations: Array, favoriteCampaigns: Array, loading: boolean, error: string|null, requestStatuses: Object, pendingRequestIds: Object }} */
  const [state, setState] = useState({
    campaigns: [],
    joinedCampaigns: [],
    invitations: [],
    favoriteCampaigns: [],
    loading: true,
    error: null,
    requestStatuses: {},
    pendingRequestIds: {},
  });

  const { user } = useAuthStore();
  const userId = user?.onboardedDetails?._id;

  /**
   * Fetches available campaigns and their interaction statuses.
   * Filters for 'apply' or 'public' campaign types.
   * @async
   */
  const fetchCampaigns = async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const campaignsResponse = await api.get("/campaign");
      const campaignsData = campaignsResponse.data || [];
      const filteredCampaigns = campaignsData.filter(
        (campaign) =>
          campaign.basics?.campaignType === "apply" ||
          campaign.basics?.campaignType === "public"
      );

      const statusMap = {};
      const requestIdMap = {};

      if (userId) {
        try {
          const interactionsResponse = await api.get(`/campaign-request`);
          const userInteractions = interactionsResponse?.requests || [];

          userInteractions.forEach((interaction) => {
            statusMap[interaction.campaignId] = interaction.status;
            if (interaction.status === "pending") {
              requestIdMap[interaction.campaignId] = interaction._id;
            }
          });
        } catch (err) {
          console.error("Error fetching interaction statuses:", err);
        }
      }

      const finalStatusMap = {};
      filteredCampaigns.forEach((campaign) => {
        finalStatusMap[campaign?._id] =
          statusMap[campaign?._id] || "not_applied";
      });

      setState((prev) => ({
        ...prev,
        campaigns: filteredCampaigns,
        requestStatuses: finalStatusMap,
        pendingRequestIds: requestIdMap,
      }));
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to load campaigns. Please try again later.",
      }));
    }
  };

  /**
   * Fetches campaigns the user has joined (accepted or active).
   * @async
   */
  const fetchJoinedCampaigns = async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const response = await api.get("/campaign/joined");
      const campaignsData = response.data?.data || [];
      setState((prev) => ({ ...prev, joinedCampaigns: campaignsData }));
    } catch (error) {
      console.error("Failed to fetch joined campaigns:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to load joined campaigns. Please try again later.",
      }));
    }
  };

  /**
   * Fetches pending campaign invitations.
   * @async
   */
  const fetchInvitations = async () => {
    try {
      const response = await api.get("/campaign/invite");
      const invitationData = response.data?.data || [];
      setState((prev) => ({ ...prev, invitations: invitationData }));
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    }
  };

  /**
   * Fetches favorite campaigns for the user.
   * @async
   */
  const fetchFavoriteCampaigns = async () => {
    try {
      const response = await api.get("/favorite-campaign");
      const favoriteData = response.data?.data || [];
      setState((prev) => ({ ...prev, favoriteCampaigns: favoriteData }));
    } catch (error) {
      console.error("Failed to fetch favorite campaigns:", error);
    }
  };

  /**
   * Handles applying to an 'apply' type campaign.
   * @param {string} brandId - The ID of the brand
   * @param {string} campaignId - The ID of the campaign
   * @async
   */
  const handleApplyClick = async (brandId, campaignId) => {
    if (!brandId) {
      alert("Cannot apply: Brand information is missing.");
      return;
    }
    try {
      setState((prev) => ({
        ...prev,
        requestStatuses: { ...prev.requestStatuses, [campaignId]: "pending" },
      }));
      const response = await api.post("/campaign-request", {
        campaignId,
        brandId,
        userId,
      });

      if (response?.data) {
        setState((prev) => ({
          ...prev,
          requestStatuses: {
            ...prev.requestStatuses,
            [campaignId]: response.data.status || "pending",
          },
          pendingRequestIds:
            response.data.status === "pending" && response.data.requestId
              ? {
                  ...prev.pendingRequestIds,
                  [campaignId]: response.data.requestId,
                }
              : prev.pendingRequestIds,
        }));

        await api.post("/brand/notifications", {
          campaignId,
          userId,
          brandId,
        });
      }
    } catch (error) {
      setState((prev) => {
        const newPendingRequestIds = { ...prev.pendingRequestIds };
        delete newPendingRequestIds[campaignId];
        return {
          ...prev,
          requestStatuses: {
            ...prev.requestStatuses,
            [campaignId]: "not_applied",
          },
          pendingRequestIds: newPendingRequestIds,
        };
      });
      console.error("Apply error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to send request. Please try again."
      );
    }
  };

  /**
   * Handles joining a 'public' type campaign.
   * @param {string} brandId - The ID of the brand
   * @param {string} campaignId - The ID of the campaign
   * @async
   */
  const handleJoinClick = async (brandId, campaignId) => {
    if (!brandId) {
      alert("Cannot join: Brand information is missing.");
      return;
    }
    try {
      setState((prev) => ({
        ...prev,
        requestStatuses: { ...prev.requestStatuses, [campaignId]: "active" },
      }));
      const response = await api.post("/campaign/join", { campaignId, userId });

      if (response?.data) {
        setState((prev) => ({
          ...prev,
          requestStatuses: { ...prev.requestStatuses, [campaignId]: "active" },
        }));
        await api.post("/brand/notifications", {
          campaignId,
          userId,
          brandId,
          type: "join",
        });
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        requestStatuses: {
          ...prev.requestStatuses,
          [campaignId]: "not_applied",
        },
      }));
    }
  };

  /**
   * Handles canceling a pending campaign request.
   * @param {string} campaignId - The ID of the campaign
   * @param {string} brandId - The ID of the brand
   * @async
   */
  const handleCancelClick = async (campaignId, brandId) => {
    try {
      const requestId = state.pendingRequestIds[campaignId];

      if (requestId) {
        setState((prev) => {
          const newPendingRequestIds = { ...prev.pendingRequestIds };
          delete newPendingRequestIds[campaignId];
          return {
            ...prev,
            requestStatuses: {
              ...prev.requestStatuses,
              [campaignId]: "not_applied",
            },
            pendingRequestIds: newPendingRequestIds,
          };
        });

        const response = await api.put(`/campaign-request`, {
          requestId,
          action: "cancel",
          status: "not_applied",
        });

        if (!response.data.success) {
          await fetchCampaigns();
        }
      } else {
        setState((prev) => ({
          ...prev,
          requestStatuses: {
            ...prev.requestStatuses,
            [campaignId]: "not_applied",
          },
        }));
        await api.post("/campaign-request", {
          campaignId,
          brandId,
          userId,
          status: "not_applied",
        });
      }
    } catch (error) {
      console.error("Failed to cancel request:", error);
      await fetchCampaigns();
      alert(
        error.response?.data?.message ||
          "Failed to cancel request. Please try again."
      );
    }
  };

  /**
   * Handles accepting or declining a campaign invitation.
   * @param {string} invitationId - The ID of the invitation
   * @param {string} action - The action to perform ('accept' or 'decline')
   * @async
   */
  const handleInvitationAction = async (invitationId, action) => {
    try {
      const response = await api.put("/campaign/invite", {
        invitationId,
        action,
      });

      if (response.data.message.includes("successfully")) {
        setState((prev) => ({
          ...prev,
          invitations: prev.invitations.filter(
            (inv) => inv._id !== invitationId
          ),
        }));
        if (action === "accept") {
          await fetchCampaigns();
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} invitation:`, error);
      alert(
        error.response?.data?.message ||
          `Failed to ${action} invitation. Please try again.`
      );
    }
  };

  /**
   * Handles adding/removing a campaign from favorites.
   * @param {string} campaignId - The ID of the campaign
   * @param {string} action - 'add' or 'remove'
   * @async
   */
  const handleFavoriteClick = async (campaignId, action) => {
    try {
      const response = await api.post("/favorite-campaign", {
        campaignId,
        action,
      });

      if (response.data.action === "added") {
        await fetchFavoriteCampaigns();
      } else if (response.data.action === "removed") {
        await fetchFavoriteCampaigns();
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (userId && user?.role === "sports-ambassador") {
      Promise.all([
        fetchCampaigns(),
        fetchJoinedCampaigns(),
        fetchInvitations(),
        fetchFavoriteCampaigns(),
      ]).finally(() => setState((prev) => ({ ...prev, loading: false })));
    }
  }, [userId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Campaigns</h1>
      {/* {state.loading && <LoadingSpinner />}
      {state.error && <ErrorMessage message={state.error} />} */}
      {!state.loading &&
        !state.error &&
        state.campaigns.length === 0 &&
        state.joinedCampaigns.length === 0 &&
        state.invitations.length === 0 &&
        state.favoriteCampaigns.length === 0 && (
          <p className="text-gray-500 text-lg">
            No campaigns or invitations available.
          </p>
        )}
      {state.invitations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Invitations
          </h2>
          <CampaignList
            items={state.invitations}
            type="invitation"
            handleInvitationAction={handleInvitationAction}
          />
        </div>
      )}
      {state.campaigns.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Campaigns
          </h2>
          <CampaignList
            items={state.campaigns}
            type="campaign"
            requestStatuses={state.requestStatuses}
            handleApplyClick={handleApplyClick}
            handleJoinClick={handleJoinClick}
            handleCancelClick={handleCancelClick}
          />
        </div>
      )}
      {state.joinedCampaigns.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Joined Campaigns
          </h2>
          <CampaignList
            items={state.joinedCampaigns}
            type="joined"
            favoriteCampaigns={state.favoriteCampaigns}
            handleFavoriteClick={handleFavoriteClick}
          />
        </div>
      )}
    </div>
  );
};

export default Campaigns;
