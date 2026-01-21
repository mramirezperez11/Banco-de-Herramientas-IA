const SERVICE_PERCENTAGE = 0.08;
const SERVICE_FLAT_CRC = 350;

const calculateFees = (price, quantity) => {
  const subtotal = price * quantity;
  const percentageFee = Math.round(subtotal * SERVICE_PERCENTAGE);
  const flatFee = SERVICE_FLAT_CRC * quantity;
  const totalFees = percentageFee + flatFee;
  return {
    subtotal,
    percentageFee,
    flatFee,
    totalFees,
    total: subtotal + totalFees
  };
};

module.exports = {
  SERVICE_PERCENTAGE,
  SERVICE_FLAT_CRC,
  calculateFees
};
