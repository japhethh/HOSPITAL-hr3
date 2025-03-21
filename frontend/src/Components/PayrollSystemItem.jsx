const PayrollSystemItem = () => {
  const cardItems = [
    {
      title: "All",
      value: "20",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cardItems.map((item, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg shadow-lg text-white ${item.color}`}
        >
          <h2 className="text-2xl font-semibold">{item.title}</h2>
          <p className="text-4xl font-bold mt-2">{item.value}</p>
          <p className="mt-2 text-sm opacity-80">{item?.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PayrollSystemItem;
