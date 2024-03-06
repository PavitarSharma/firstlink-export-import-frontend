
import useViewOrderModal from '../../hooks/modals/useViewOrderModal'
import Modal from './Modal';
import { ICartItem } from '../../types';
import formatPrice from '../../utils/formatPrice';

const ViewOrderModal = ({ cart}: { cart: ICartItem[]}) => {
    const orderViewModal = useViewOrderModal();

    const body = (
        <>
        <div className='w-full'>
            {
                cart && cart.length > 0 && cart?.map((item: ICartItem) => {
                    const { product, quantity, _id} = item
                    return <div key={_id} className='flex flex-col gap-4 my-4'>
                        <div>
                            <div className='flex gap-3'>
                            <img src={product?.image.media.url} alt="image" loading='lazy' className='w-20 h-20 object-contain rounded-md' />
                            <div className='flex flex-col'>
                                <h3 className="font-medium text-gray-500 text-xs line-clamp-2">
                                    {product?.title}
                                </h3>

                                <span className='text-xs text-primary font-semibold'>
                                    {formatPrice(product?.price, product?.currency)}
                                </span>
                                <span className='text-xs mt-2'>
                                    Quantity: {quantity}
                                </span>
                            </div>
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
        </>
    )
  return (
    <Modal isOpen={orderViewModal.isOpen} onClose={orderViewModal.onClose} body={body} width='xl' />
  )
}

export default ViewOrderModal