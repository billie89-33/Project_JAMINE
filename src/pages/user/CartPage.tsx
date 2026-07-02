import { CartPageContainer } from '@/modules/cart';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between">
      
      <main className="flex-grow">
        <CartPageContainer />
      </main>
      
    </div>
  );
}