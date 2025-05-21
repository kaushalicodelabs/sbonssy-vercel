import moment from "moment";

/**
 * Unified card component for displaying campaigns, joined campaigns, invitations, and favorite campaigns.
 * Renders a consistent UI with conditional buttons or statuses based on type.
 * @param {Object} props
 * @param {Object} props.item - The campaign or invitation data
 * @param {string} props.type - The type of item ('campaign', 'joined', 'invitation', or 'favorite')
 * @param {Object} [props.requestStatuses] - Statuses of campaign interactions
 * @param {Function} [props.handleApplyClick] - Handler for applying to a campaign
 * @param {Function} [props.handleJoinClick] - Handler for joining a campaign
 * @param {Function} [props.handleCancelClick] - Handler for canceling a request
 * @param {Function} [props.handleInvitationAction] - Handler for accepting/declining invitations
 * @param {boolean} [props.isFavorite] - Whether the campaign is favorited
 * @param {Function} [props.handleFavoriteClick] - Handler for adding/removing favorites
 * @returns {JSX.Element} The CampaignCard component
 */
const CampaignCard = ({
  item,
  type,
  requestStatuses = {},
  handleApplyClick,
  handleJoinClick,
  handleCancelClick,
  handleInvitationAction,
  isFavorite,
  handleFavoriteClick,
}) => {
  // Normalize data for consistent rendering
  const isInvitation = type === "invitation";
  const isJoined = type === "joined";
  const isFavoriteCampaign = type === "favorite";
  const campaignData = isInvitation
    ? {
        _id: item._id,
        title: item.campaignTitle,
        brandName: item.brandName,
        campaignType: "private",
        description: item.description || "No description available",
        logo: item.logo || "",
        isOngoing: item.isOngoing || false,
        startDate: item.startDate || null,
        endDate: item.endDate || null,
        createdAt: item.createdAt,
      }
    : {
        _id: item._id,
        title: isJoined || isFavoriteCampaign ? item.title : item.basics?.title,
        brandName: item.brandName,
        campaignType:
          isJoined || isFavoriteCampaign
            ? item.campaignType
            : item.basics?.campaignType,
        description:
          isJoined || isFavoriteCampaign
            ? item.description
            : item.basics?.description || "No description available",
        logo:
          isJoined || isFavoriteCampaign
            ? item.logo
            : item.assets?.logos?.[0]?.url || "",
        isOngoing:
          isJoined || isFavoriteCampaign
            ? item.isOngoing
            : item.basics?.isOngoing || false,
        startDate:
          isJoined || isFavoriteCampaign
            ? item.startDate
            : item.basics?.startDate || null,
        endDate:
          isJoined || isFavoriteCampaign
            ? item.endDate
            : item.basics?.endDate || null,
        brandId: item.brandId,
      };

  /**
   * Renders the appropriate button or status UI based on campaign type and status.
   * @returns {JSX.Element|null} The button or status element
   */
  const getButtonUI = () => {
    if (isJoined) {
      return (
        <div className="space-y-2">
          <div className="text-green-600 text-sm font-semibold text-center">
            Joined
          </div>
          <button
            onClick={() =>
              handleFavoriteClick(
                campaignData._id,
                isFavorite ? "remove" : "add"
              )
            }
            className={`w-full text-white text-sm font-medium py-2 px-4 rounded ${
              isFavorite
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-purple-600 hover:bg-purple-700"
            } transition-colors`}
          >
            {isFavorite ? "Remove from Profile" : "Add to Profile"}
          </button>
        </div>
      );
    }

    if (isFavoriteCampaign) {
      return (
        <button
          onClick={() => handleFavoriteClick(campaignData._id, "remove")}
          className="w-full text-white text-sm font-medium py-2 px-4 rounded bg-gray-600 hover:bg-gray-700 transition-colors"
        >
          Remove from Profile
        </button>
      );
    }

    if (isInvitation) {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleInvitationAction(item._id, "accept")}
            className="flex-1 text-white text-sm font-medium py-2 px-4 rounded bg-green-600 hover:bg-green-700 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleInvitationAction(item._id, "decline")}
            className="flex-1 text-white text-sm font-medium py-2 px-4 rounded bg-red-500 hover:bg-red-600 transition-colors"
          >
            Decline
          </button>
        </div>
      );
    }

    const status = requestStatuses[campaignData._id];
    const brandId = campaignData.brandId;

    if (campaignData.campaignType === "apply") {
      switch (status) {
        case "not_applied":
          return (
            <button
              onClick={() => handleApplyClick(brandId, campaignData._id)}
              className="w-full text-white text-sm font-medium py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={!brandId}
            >
              Request to Join
            </button>
          );
        case "pending":
          return (
            <>
              <div className="text-yellow-600 text-sm font-semibold text-center mb-2">
                Pending
              </div>
              <button
                onClick={() => handleCancelClick(campaignData._id, brandId)}
                className="w-full text-white text-sm font-medium py-2 px-4 rounded bg-red-500 hover:bg-red-600 transition-colors"
              >
                Cancel Request
              </button>
            </>
          );
        case "accepted":
          return (
            <div className="text-green-600 text-sm font-semibold text-center">
              Accepted
            </div>
          );
        case "rejected":
          return (
            <div className="text-red-600 text-sm font-semibold text-center">
              Rejected
            </div>
          );
        default:
          return (
            <button
              onClick={() => handleApplyClick(brandId, campaignData._id)}
              className="w-full text-white text-sm font-medium py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={!brandId}
            >
              Request to Join
            </button>
          );
      }
    } else if (campaignData.campaignType === "public") {
      switch (status) {
        case "not_applied":
          return (
            <button
              onClick={() => handleJoinClick(brandId, campaignData._id)}
              className="w-full text-white text-sm font-medium py-2 px-4 rounded bg-green-600 hover:bg-green-700 transition-colors"
              disabled={!brandId}
            >
              Join Now
            </button>
          );
        case "active":
          return (
            <div className="text-green-600 text-sm font-semibold text-center">
              Joined
            </div>
          );
        default:
          return (
            <button
              onClick={() => handleJoinClick(brandId, campaignData._id)}
              className="w-full text-white text-sm font-medium py-2 px-4 rounded bg-green-600 hover:bg-green-700 transition-colors"
              disabled={!brandId}
            >
              Join Now
            </button>
          );
      }
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border-2">
      {campaignData.logo && (
        <img
          src={campaignData.logo}
          alt="logo"
          className="h-24 w-24 object-contain mx-auto mb-4"
        />
      )}
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        {campaignData.title || "N/A"}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Brand:</span>{" "}
        {campaignData.brandName || "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Type:</span>{" "}
        {campaignData.campaignType
          ? campaignData.campaignType.charAt(0).toUpperCase() +
            campaignData.campaignType.slice(1)
          : "N/A"}
      </p>
      {isInvitation && (
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Invited:</span>{" "}
          {moment(campaignData.createdAt).format("LL")}
        </p>
      )}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {campaignData.description}
      </p>
      {campaignData.isOngoing ? (
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Status:</span> Ongoing
        </p>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Start:</span>{" "}
            {moment(campaignData.startDate).format("LL") || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">End:</span>{" "}
            {moment(campaignData.endDate).format("LL") || "N/A"}
          </p>
        </div>
      )}
      {getButtonUI()}
    </div>
  );
};

export default CampaignCard;
