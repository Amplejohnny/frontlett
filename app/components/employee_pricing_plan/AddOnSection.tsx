// This component is used to display the "Add-ons" section in the pricing plan page.
const AddOnsSection = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-5 my-16 max-w-2xl mx-auto">
      <h3 className="font-semibold mb-3">Add-ons</h3>
      <ul className="text-sm space-y-2 text-[#0F1729]">
        <li>
          <span className="text-green-600 mr-2">✔️</span> Get more profile at
          ₦2,000
        </li>
        <li>
          <span className="text-green-600 mr-2">✔️</span> Get more Resource Type
          at ₦2,000
        </li>
      </ul>
    </div>
  );
};

export default AddOnsSection;
