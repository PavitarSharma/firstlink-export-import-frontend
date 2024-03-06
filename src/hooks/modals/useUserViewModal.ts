import { create } from "zustand";

interface UserModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUserViewModal = create<UserModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useUserViewModal;
