
import ChangePassword from '../../components/admin/profile/ChangePassword'
import MyProfile from '../../components/admin/profile/MyProfile'

const AdminProfile = () => {
  return (
    <div className='container'>
        <MyProfile />

        <div className='flex mt-10 gap-8'>
           <div className='md:w-1/2 w-full'><ChangePassword /></div>
        </div>
    </div>
  )
}

export default AdminProfile