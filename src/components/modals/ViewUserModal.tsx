import { format } from "date-fns";
import useUserViewModal from "../../hooks/modals/useUserViewModal";
import { IUser } from "../../types";
import Modal from "./Modal";

interface ViewUserProps {
  user: IUser;
}
const ViewUserModal = ({ user }: ViewUserProps) => {
  const viewUserModal = useUserViewModal();

  const body = (
    <div>
      <img
        src={user?.profileImg ? user?.profileImg?.url : "/images/user.png"}
        alt="profile"
        className="w-16 h-16 rounded-full object-cover border border-gray-300"
      />

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Name:</span>
          <span className="text-sm text-gray-600">{user?.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Email:</span>
          <span className="text-sm text-gray-600">{user?.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Username:</span>
          <span className="text-sm text-gray-600">@ {user?.username}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Phone:</span>
          <span className="text-sm text-gray-600">{user?.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Role:</span>
          <span className="text-sm text-gray-600">{user?.role}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Created At:</span>
          <span className="text-sm text-gray-600">
            {format(user?.createdAt, "dd MMM, yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      isOpen={viewUserModal.isOpen}
      onClose={viewUserModal.onClose}
      body={body}
    />
  );
};

export default ViewUserModal;
