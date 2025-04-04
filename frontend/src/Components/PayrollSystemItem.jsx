const PayrollSystemItem = ({data , title}) => {
  const cardItems = [
    {
      title: title,
      value: data.length,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
      {cardItems.map((item, index) => (
        <div
          key={index}
          className={`p-5 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 shadow-lg text-white ${item.color}`}
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
