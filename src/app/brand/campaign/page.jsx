// components/Campaign.jsx
"use client";
import api from "@/lib/axios";
import { capitalizeFirstLetter } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useCallback } from "react";

const Campaign = () => {
  const { user } = useAuthStore();
  const brandId = user?.onboardedDetails?._id;
  const router = useRouter();

  const [state, setState] = React.useState({
    campaigns: [],
    isModalOpen: false,
    ambassadors: [],
    selectedAmbassadors: [],
    currentCampaignId: null,
    isLoading: false,
    page: 1,
    hasMore: true,
  });

  const observer = useRef();

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const fetchCampaigns = useCallback(async () => {
    if (!brandId) return;
    try {
      const response = await api.get(`/campaign?brandId=${brandId}`);
      updateState({ campaigns: response?.data || [] });
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  }, [brandId]);

  const fetchAmbassadors = useCallback(
    async (pageNum) => {
      if (!state.hasMore || state.isLoading) return;
      updateState({ isLoading: true });
      try {
        const response = await api.get(
          `/campaign/ambassadors?page=${pageNum}&limit=10`
        );
        const { data, pagination } = response.data;
        updateState({
          ambassadors: pageNum === 1 ? data : [...state.ambassadors, ...data],
          hasMore: pageNum < pagination.totalPages,
        });
      } catch (error) {
        console.error("Failed to fetch ambassadors:", error);
      } finally {
        updateState({ isLoading: false });
      }
    },
    [state.hasMore, state.isLoading, state.ambassadors]
  );

  const lastAmbassadorElementRef = useCallback(
    (node) => {
      if (state.isLoading || !state.hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateState({ page: state.page + 1 });
        }
      });
      if (node) observer.current.observe(node);
    },
    [state.isLoading, state.hasMore, state.page]
  );

  const openInviteModal = (campaignId) => {
    updateState({
      currentCampaignId: campaignId,
      page: 1,
      ambassadors: [],
      selectedAmbassadors: [],
      hasMore: true,
      isModalOpen: true,
    });
    fetchAmbassadors(1);
  };

  const closeInviteModal = () => {
    updateState({
      isModalOpen: false,
      currentCampaignId: null,
      ambassadors: [],
      selectedAmbassadors: [],
      page: 1,
      hasMore: true,
    });
  };

  const handleSelectAmbassador = (ambassadorId) => {
    updateState({
      selectedAmbassadors: state.selectedAmbassadors.includes(ambassadorId)
        ? state.selectedAmbassadors.filter((id) => id !== ambassadorId)
        : [...state.selectedAmbassadors, ambassadorId],
    });
  };

  const handleSendInvitations = async () => {
    if (state.selectedAmbassadors.length === 0) {
      alert("Please select at least one ambassador.");
      return;
    }
    updateState({ isLoading: true });
    try {
      await api.post("/campaign/invite", {
        campaignId: state.currentCampaignId,
        ambassadorIds: state.selectedAmbassadors,
      });
      closeInviteModal();
    } catch (error) {
      console.error("Failed to send invitations:", error);
      alert("Failed to send invitations. Please try again.");
    } finally {
      updateState({ isLoading: false });
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    if (state.isModalOpen && state.page > 1) {
      fetchAmbassadors(state.page);
    }
  }, [state.page, state.isModalOpen, fetchAmbassadors]);

  useEffect(() => {
    document.body.style.overflow = state.isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [state.isModalOpen]);

  const renderCampaignCard = (campaign, index) => {
    const basicDetails = campaign?.basics;
    return (
      <div
        key={index}
        className="bg-white rounded-2xl shadow-md overflow-hidden p-4 flex flex-col items-center border-2"
      >
        <div className="w-24 h-24 mb-4 flex items-center justify-center">
          <img
            src={campaign?.assets?.logos?.[0]?.url}
            alt="campaign logo"
            className="object-contain w-full h-full"
          />
        </div>
        <h2 className="text-lg font-semibold text-center">
          {basicDetails?.title || "Untitled Campaign"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Campaign Type: {capitalizeFirstLetter(basicDetails?.campaignType)}
        </p>
        <p className="text-sm text-emerald-950 mt-1">
          Status: {campaign?.status || "Status unknown"}
        </p>
        {basicDetails?.campaignType === "private" && (
          <button
            onClick={() => openInviteModal(campaign._id)}
            className="mt-4 bg-[#f26915] text-white font-semibold py-2 px-4 rounded-full border-2 border-[#f26915] hover:bg-white hover:text-[#f26915] transition duration-300 disabled:bg-gray-400"
            disabled={state.isLoading}
          >
            {state.isLoading ? "Loading..." : "Invite Ambassadors"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button
          onClick={() => router.push("/brand/campaign/create")}
          className="bg-[#f26915] text-white font-semibold py-2 px-4 rounded-full border-2 border-[#f26915] hover:bg-white hover:text-[#f26915] transition duration-300"
        >
          Create Campaign
        </button>
      </header>

      {state.campaigns.length === 0 ? (
        <p className="text-gray-500 text-center">No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {state.campaigns.map(renderCampaignCard)}
        </div>
      )}

      {state.isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[50vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Ambassadors</h2>
              <button
                onClick={closeInviteModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {state.ambassadors.length === 0 && !state.isLoading ? (
              <p className="text-gray-500 text-center">No ambassadors found.</p>
            ) : (
              <div className="space-y-2">
                {state.ambassadors.map((ambassador, index) => {
                  const isLastElement = state.ambassadors.length === index + 1;
                  return (
                    <div
                      key={ambassador._id}
                      ref={isLastElement ? lastAmbassadorElementRef : null}
                      className="flex items-center space-x-2 p-2 border-b"
                    >
                      <input
                        type="checkbox"
                        checked={state.selectedAmbassadors.includes(
                          ambassador._id
                        )}
                        onChange={() => handleSelectAmbassador(ambassador._id)}
                        className="h-5 w-5 text-[#f26915] rounded"
                        disabled={state.isLoading}
                      />
                      <label className="text-sm">
                        {ambassador.name || ambassador.email} (
                        {capitalizeFirstLetter(ambassador.subRole)})
                      </label>
                    </div>
                  );
                })}
                {state.isLoading && (
                  <p className="text-gray-500 text-center">Loading more...</p>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={closeInviteModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                disabled={state.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvitations}
                className="px-4 py-2 bg-[#f26915] text-white rounded-full hover:bg-[#d95e13] disabled:bg-gray-400"
                disabled={
                  state.isLoading || state.selectedAmbassadors.length === 0
                }
              >
                {state.isLoading ? "Sending..." : "Send Invitations"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaign;
