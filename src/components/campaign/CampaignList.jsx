import CampaignCard from "./CampaignCard";

/**
 * Component to render a grid of campaign cards.
 * @param {Object} props
 * @param {Array} props.items - Array of campaign or invitation items
 * @param {string} props.type - Type of items ('campaign', 'joined', 'invitation', or 'favorite')
 * @param {Object} [props.requestStatuses] - Statuses of campaign interactions
 * @param {Function} [props.handleApplyClick] - Handler for applying to a campaign
 * @param {Function} [props.handleJoinClick] - Handler for joining a campaign
 * @param {Function} [props.handleCancelClick] - Handler for canceling a request
 * @param {Function} [props.handleInvitationAction] - Handler for accepting/declining invitations
 * @param {Array} [props.favoriteCampaigns] - Array of favorite campaigns
 * @param {Function} [props.handleFavoriteClick] - Handler for adding/removing favorites
 * @returns {JSX.Element} The CampaignList component
 */
const CampaignList = ({
  items,
  type,
  requestStatuses,
  handleApplyClick,
  handleJoinClick,
  handleCancelClick,
  handleInvitationAction,
  favoriteCampaigns,
  handleFavoriteClick,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => (
      <CampaignCard
        key={item._id}
        item={item}
        type={type}
        requestStatuses={requestStatuses}
        handleApplyClick={handleApplyClick}
        handleJoinClick={handleJoinClick}
        handleCancelClick={handleCancelClick}
        handleInvitationAction={handleInvitationAction}
        isFavorite={favoriteCampaigns?.some((fav) => fav._id === item._id)}
        handleFavoriteClick={handleFavoriteClick}
      />
    ))}
  </div>
);

export default CampaignList;
