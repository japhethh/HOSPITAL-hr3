import React from "react";

const StepFunc = () => {
  // Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/payrollSystem`);
      console.log(response.data.data);
      setInventoryData(response.data.data);
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };

  // Create
  const handleCreatePayroll = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/api/payrollSystem/`,
        newPayrollData
      );

      fetchData();
      toast.success("Created Successfully!");
    } catch (error) {
      console.log(error?.response.data.message);
    }

    setCreateModalOpen(false);
    setNewPayrollData({
      employeeId: "",
      name: "",
      department: "",
      position: "",
      email: "",
      phone: "",
      salary: "",
      hireDate: "",
      status: "Active",
    });
  };

  // Update

  const handleUpdatePayroll = async () => {
    try {
      const response = await axios.put(
        `${apiURL}/api/payrollSystem/${selectedData.employeeId}`,
        selectedData
      );

      fetchData();
      toast.success(response.data.message);

      // Update the local state if needed
      setInventoryData(response.data.message);

      setShowModal(false);
      setSelectedData(null);
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update payroll");
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiURL}/api/payrollSystem/${selectedData}`
      );

      toast.info("Deleted Successfully!");

      fetchData();
    } catch (error) {
      console.log(error?.response.data.message);
      toast.error("Failed to update payroll");
    }
    if (selectedData) {
      const updatedData = inventoryData.filter(
        (item) => item.employeeId !== selectedData.employeeId
      );
      setInventoryData(updatedData);
      setShowModal(false);
      setSelectedData(null);
    }
  };

  return <div>StepFunc</div>;
};

export default StepFunc;
