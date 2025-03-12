// seedProducts.js
const mongoose = require("mongoose");
const Product = require("./models/Product");

// MongoDB connection URL - adjust according to your setup
const mongoURI = "mongodb://localhost:27017/ezkitlabs";

// Product data expanded to 20+ items
const productsToInsert = [
  {
    name: "Smart Home Controller Kit",
    shortDescription:
      "Complete kit for automating lights, temperature, and security",
    price: 89.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Pre-tested components", "WiFi enabled"],
    features: ["Remote control", "Easy setup"],
    inTheBox: ["Controller", "Sensors", "Manual"],
    difficulty: "Medium",
    completionTime: "4-6 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "IoT Weather Station",
    shortDescription: "Internet-connected weather monitoring system",
    price: 59.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Temperature sensor", "Humidity sensor"],
    features: ["Real-time data", "Mobile app"],
    inTheBox: ["Sensors", "Board", "Guide"],
    difficulty: "Easy",
    completionTime: "2-3 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Beginner Robot Arm",
    shortDescription: "Educational robot arm with programming guide",
    price: 129.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["4-axis movement", "USB interface"],
    features: ["Step-by-step guide", "Customizable"],
    inTheBox: ["Arm parts", "Motors", "Manual"],
    difficulty: "Medium",
    completionTime: "6-8 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Automated Garden System",
    shortDescription: "Self-watering and monitoring system for plants",
    price: 74.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Soil sensors", "Water pump"],
    features: ["Auto-watering", "App control"],
    inTheBox: ["Pump", "Sensors", "Tubing"],
    difficulty: "Medium",
    completionTime: "3-5 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Voice Assistant Device",
    shortDescription: "DIY voice-controlled assistant",
    price: 99.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Microphone array", "Speaker"],
    features: ["Voice recognition", "Custom commands"],
    inTheBox: ["Mic", "Speaker", "Board"],
    difficulty: "Hard",
    completionTime: "8-10 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Autonomous Rover Kit",
    shortDescription: "Programmable rover with obstacle avoidance",
    price: 149.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Ultrasonic sensors", "4WD"],
    features: ["Wireless control", "Obstacle avoidance"],
    inTheBox: ["Chassis", "Motors", "Sensors"],
    difficulty: "Hard",
    completionTime: "10-12 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Smart Energy Monitor",
    shortDescription: "DIY home energy usage tracker",
    price: 49.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Current sensor", "LCD display"],
    features: ["Real-time monitoring", "Data logging"],
    inTheBox: ["Sensor", "Display", "Wires"],
    difficulty: "Easy",
    completionTime: "2-3 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Wearable Health Tracker",
    shortDescription: "DIY fitness and health monitoring wearable",
    price: 69.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Heart rate sensor", "OLED screen"],
    features: ["Step counter", "Pulse monitor"],
    inTheBox: ["Sensors", "Band", "Board"],
    difficulty: "Medium",
    completionTime: "4-6 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Programmable LED Matrix",
    shortDescription: "16x16 RGB LED matrix for light displays",
    price: 39.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["256 LEDs", "RGB colors"],
    features: ["Custom patterns", "Animation support"],
    inTheBox: ["LED matrix", "Controller", "Cables"],
    difficulty: "Easy",
    completionTime: "1-2 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Quadcopter Drone Kit",
    shortDescription: "Programmable drone with camera mount",
    price: 179.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["4 motors", "Flight controller"],
    features: ["Remote control", "Stable flight"],
    inTheBox: ["Frame", "Motors", "Controller"],
    difficulty: "Hard",
    completionTime: "12-15 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Home Security System",
    shortDescription: "DIY security system with motion sensors",
    price: 119.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["PIR sensors", "Camera module"],
    features: ["Mobile alerts", "Night vision"],
    inTheBox: ["Sensors", "Camera", "Board"],
    difficulty: "Medium",
    completionTime: "6-8 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "RFID Access Control",
    shortDescription: "Custom access control with RFID",
    price: 64.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["RFID reader", "Relay module"],
    features: ["Card access", "Lock control"],
    inTheBox: ["Reader", "Cards", "Relay"],
    difficulty: "Medium",
    completionTime: "3-4 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Smart Mirror Kit",
    shortDescription: "DIY interactive mirror with display",
    price: 139.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["LCD panel", "Two-way mirror"],
    features: ["Weather display", "Touch control"],
    inTheBox: ["Mirror", "Display", "Sensors"],
    difficulty: "Hard",
    completionTime: "10-12 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Bluetooth Audio Receiver",
    shortDescription: "Add Bluetooth to any speaker system",
    price: 34.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Bluetooth 5.0", "Audio jack"],
    features: ["Wireless audio", "Low latency"],
    inTheBox: ["Receiver", "Cable", "Guide"],
    difficulty: "Easy",
    completionTime: "1-2 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Gesture Control Kit",
    shortDescription: "Control devices with hand gestures",
    price: 79.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Gesture sensor", "IR module"],
    features: ["Multi-gesture", "Customizable"],
    inTheBox: ["Sensor", "Board", "Manual"],
    difficulty: "Medium",
    completionTime: "4-5 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Mini CNC Machine",
    shortDescription: "Desktop CNC for small projects",
    price: 199.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["300x200mm area", "Spindle motor"],
    features: ["Engraving", "Cutting"],
    inTheBox: ["Frame", "Motor", "Tools"],
    difficulty: "Hard",
    completionTime: "15-20 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Smart Doorbell",
    shortDescription: "Video doorbell with mobile access",
    price: 89.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["HD camera", "WiFi module"],
    features: ["Live view", "Motion detection"],
    inTheBox: ["Camera", "Bell", "Mount"],
    difficulty: "Medium",
    completionTime: "3-5 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Temperature Control Fan",
    shortDescription: "Auto-adjusting fan based on temperature",
    price: 44.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Temp sensor", "DC fan"],
    features: ["Auto-speed", "Quiet operation"],
    inTheBox: ["Fan", "Sensor", "Board"],
    difficulty: "Easy",
    completionTime: "2-3 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Smart Pet Feeder",
    shortDescription: "Automated pet feeding with schedule",
    price: 109.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Food dispenser", "Timer"],
    features: ["App control", "Portion settings"],
    inTheBox: ["Dispenser", "Bowl", "Power"],
    difficulty: "Medium",
    completionTime: "5-7 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "Solar Tracker Kit",
    shortDescription: "Optimize solar panel efficiency",
    price: 69.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Light sensors", "Servo motors"],
    features: ["Sun tracking", "Energy monitor"],
    inTheBox: ["Sensors", "Motors", "Frame"],
    difficulty: "Medium",
    completionTime: "4-6 hours",
    reviews: [],
    relatedProducts: [],
  },
  {
    name: "DIY Smart Lock",
    shortDescription: "Keyless entry system with app",
    price: 94.99,
    images: [
      "https://cdn.pixabay.com/photo/2015/12/07/01/38/arduino-1080213_1280.jpg",
    ],
    specifications: ["Servo lock", "Bluetooth"],
    features: ["Remote unlock", "Guest access"],
    inTheBox: ["Lock", "Board", "Battery"],
    difficulty: "Medium",
    completionTime: "5-7 hours",
    reviews: [],
    relatedProducts: [],
  },
];

// Seeding function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing products (optional)
    // await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert products
    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`${insertedProducts.length} products inserted successfully`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seeding
seedDatabase();
