import { useForm } from "react-hook-form";
import useCreateUserModal from "../../hooks/modals/useCreateUserModal";
import { CreateUserSchema } from "../../schemas";
import Modal from "./Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../layout/inputs/Input";
import * as z from "zod";
import { BsTelephone } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { LuKeyRound, LuUser2 } from "react-icons/lu";
import Button from "../layout/buttons/Button";
import { axiosPrivate } from "../../config/api";
import { useAppDispatch } from "../../redux/hooks";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { handleApiError } from "../../utils/handleApiError";
import { addUser } from "../../redux/slices/adminSlice";

type Schema = z.infer<typeof CreateUserSchema>;
const CreateUserModal = () => {
  const createUserModal = useCreateUserModal();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = async (values: Schema) => {
    const responseData = {
      ...values,
      verified: true,
    };

    try {
      const { data } = await axiosPrivate.post("/admin/users/create-user", responseData);
      toast.success("User created successfully");
      dispatch(addUser(data));
      createUserModal.onClose()
      reset()
    } catch (error) {
      let message;

      if (error instanceof AxiosError) {
        message = handleApiError(error);
      } else {
        message = "An unexpected error occurred.";
      }

      toast.error(message);
    }
  };
  const body = (
    <form className="flex flex-col gap-2">
      <Input
        id="name"
        register={register}
        error={errors.name?.message}
        label="Username"
        placeholder="John Doe"
        icon={LuUser2}
      />
      <Input
        type="email"
        id="email"
        register={register}
        error={errors.email?.message}
        label="Email"
        placeholder="john.doe@email.com"
        icon={IoMailOutline}
      />
      <Input
        id="phone"
        register={register}
        placeholder="+1 888234765"
        icon={BsTelephone}
        label="Phone"
        error={errors.phone?.message}
      />
      <Input
        type="password"
        id="password"
        register={register}
        placeholder="**********"
        icon={LuKeyRound}
        label="Password"
        error={errors.password?.message}
      />
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Role
        </label>
        <select
          id="role"
          {...register("role")}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 outline-0 "
        >
          <option selected>Choose a Role</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <Button label="Submit" onClick={handleSubmit(onSubmit)} />
    </form>
  );
  return (
    <Modal
      isOpen={createUserModal.isOpen}
      onClose={createUserModal.onClose}
      body={body}
    />
  );
};

export default CreateUserModal;
