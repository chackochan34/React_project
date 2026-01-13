const states = [
  "KL 07 AB",
  "KL 01 AA",
  "TN 09 ZZ",
  "MH 01 AB",
  "DL 01 AA",
  "KA 01 AB",
];

const fancyNumbers = [
  "0001", "0007", "0009", "0011", "0077", "0088", "0099",
  "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999",
  "1234", "2345", "3456", "4567", "5678",
  "1221", "2112", "3443", "4554", "5665", "6776",
  "7878", "9090", "6969", "8080"
];

const statuses = ["ongoing", "upcoming", "completed"];

let id = 1;

const platesData = [];

states.forEach((state) => {
  fancyNumbers.forEach((num) => {
    platesData.push({
      id: id++,
      number: `${state} ${num}`,
      type: num === "0001" || num === "9999" || num === "7777" ? "VIP" : "Fancy",
      price: Math.floor(150000 + Math.random() * 400000),
      bids: Math.floor(20 + Math.random() * 400),
      time: Math.floor(Math.random() * 400),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  });
});

export default platesData;
