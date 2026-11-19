'use client';

export default function AddToCartButton() {
  return (
    <button
      disabled
      className="w-full py-3 px-6 rounded-lg bg-[#45A29E] text-[#C5C6C7] font-semibold cursor-not-allowed opacity-50"
      title="Кошик скоро з'явиться"
    >
      Додати в кошик
    </button>
  );
}
