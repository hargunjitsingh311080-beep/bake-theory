import { useState, useEffect, useMemo } from 'react';
import { 
  Cake, 
  Heart, 
  Calendar, 
  Clock, 
  Sparkles, 
  Phone, 
  Search, 
  Lock, 
  User, 
  Check, 
  AlertCircle, 
  ShoppingBag, 
  Plus, 
  CreditCard, 
  Clipboard, 
  TrendingUp, 
  LogOut, 
  MapPin, 
  Truck, 
  DollarSign, 
  Filter, 
  RefreshCw, 
  MessageSquare, 
  ChevronRight, 
  Printer,
  ChevronDown,
  FileText
} from 'lucide-react';

// ==========================================
// CONSTANTS & INTERFACES
// ==========================================

export interface CakeOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupOrDelivery: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryDate: string;
  deliveryTime: string;
  
  // Specs
  sizeKg: number; 
  tiers: number; 
  shape: 'round' | 'square' | 'heart' | 'hexagon';
  flavor: string; 
  frosting: string; 
  filling: string; 
  accentColor: string; 
  customMessage: string; 
  toppings: string[];
  specialNotes: string; 
  
  // Finance
  basePrice: number;
  flavorSurcharge: number;
  tiersSurcharge: number;
  decorSurcharge: number;
  deliveryFee: number;
  discount: number;
  totalPrice: number;
  
  // Payment Status
  paymentStatus: 'unpaid' | 'deposit_paid' | 'paid_in_full';
  paymentMethod: 'upi' | 'cash' | 'bank_transfer' | 'other';
  depositAmount: number;
  amountPaid: number;
  paymentNotes?: string;
  
  // Management
  orderStatus: 'pending' | 'approved' | 'baking' | 'finishing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  referencePhotoBase64?: string;
  referencePhotoName?: string;
}

export interface SignatureCake {
  id: string;
  name: string;
  description: string;
  image: string;
  baseSize: number;
  baseTiers: number;
  baseShape: 'round' | 'square' | 'heart' | 'hexagon';
  baseFlavor: string;
  baseFrosting: string;
  baseFilling: string;
  baseToppings: string[];
  baseColor: string;
  tags: string[];
  price: number;
}

const DEFAULT_SIGNATURE_CAKES: SignatureCake[] = [
  {
    id: "SC-101",
    name: "Classic Rose Bouquet",
    description: "An elegant, romantic highlight perfect for birthdays and anniversaries. Adorned with delicate buttercream rose transfers, beautiful sugar pearls, and a warm honey gold base tint.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?q=80&w=600&auto=format&fit=crop",
    baseSize: 1.5,
    baseTiers: 1,
    baseShape: "round",
    baseFlavor: "Red Velvet Velvet Cream",
    baseFrosting: "Silky Buttercream",
    baseFilling: "Fresh Strawberry Compote",
    baseToppings: ["pearls", "gold_foil"],
    baseColor: "#EEDAA2",
    tags: ["Anniversary", "Birthday", "Elegant"],
    price: 1890
  },
  {
    id: "SC-102",
    name: "Double Chocolate Dream",
    description: "Deep decadent Belgian chocolate layers filled with pure Nutella frosting cream and decorated with glazed maraschino cherries and flowing hot chocolate drips.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop",
    baseSize: 1.0,
    baseTiers: 1,
    baseShape: "round",
    baseFlavor: "Belgian Chocolate Fudge",
    baseFrosting: "Rich Chocolate Ganache",
    baseFilling: "Pure Premium Nutella Spread",
    baseToppings: ["cherries", "ganache_drips"],
    baseColor: "#4E3629",
    tags: ["Chocolate", "Birthday", "Celebration"],
    price: 1440
  },
  {
    id: "SC-103",
    name: "Pastel Princess Magic",
    description: "Multi-layered towering pastel colored marvel featuring majestic vanilla flavor, silky smooth buttercream casing, edible 24k gold leaf details, French macarons, and rainbow sprinkles.",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=600&auto=format&fit=crop",
    baseSize: 2.0,
    baseTiers: 2,
    baseShape: "round",
    baseFlavor: "Classic Vanilla Bean",
    baseFrosting: "Silky Buttercream",
    baseFilling: "none",
    baseToppings: ["sprinkles", "macarons", "gold_foil"],
    baseColor: "#FFD3DF",
    tags: ["Kids", "Birthday", "Vibrant"],
    price: 2650
  },
  {
    id: "SC-104",
    name: "Espresso Mocha Crunch",
    description: "A coffee lover's absolute crown jewel! Baked with rich, deep-brewed espresso crumbles, layered with coffee mocha cream, caramel drips, and finished with caramelized walnuts and gold flakes.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    baseSize: 1.5,
    baseTiers: 1,
    baseShape: "square",
    baseFlavor: "Espresso Mocha Crunch",
    baseFrosting: "Silky Buttercream",
    baseFilling: "Crushed Oreo Cookie Creme",
    baseToppings: ["gold_foil", "ganache_drips"],
    baseColor: "#E2D4F0",
    tags: ["Coffee", "Birthday", "Modern"],
    price: 2190
  },
  {
    id: "SC-105",
    name: "Heart-to-Heart Velvet Rouge",
    description: "Celebrate deep romantic anniversaries with this exquisite heart-shaped masterpiece. Rich velvety crumb layers sandwiched between fresh strawberry spreads and silky buttercream piping.",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f8011b?q=80&w=600&auto=format&fit=crop",
    baseSize: 1.0,
    baseTiers: 1,
    baseShape: "heart",
    baseFlavor: "Red Velvet Velvet Cream",
    baseFrosting: "Silky Buttercream",
    baseFilling: "Fresh Strawberry Compote",
    baseToppings: ["pearls", "cherries"],
    baseColor: "#FFD3DF",
    tags: ["Romance", "Anniversary", "Heart"],
    price: 1540
  },
  {
    id: "SC-106",
    name: "Fresh Strawberry Meadow",
    description: "Light, summery bliss incorporating pure vanilla sponge, whipped Chantilly cream frosting layers, filled with seasonal strawberry reduction, and top-piled with fresh glazed strawberries.",
    image: "https://images.unsplash.com/photo-1557925923-cd4648e21187?q=80&w=600&auto=format&fit=crop",
    baseSize: 1.0,
    baseTiers: 1,
    baseShape: "round",
    baseFlavor: "Classic Vanilla Bean",
    baseFrosting: "Whipped Chantilly",
    baseFilling: "Fresh Strawberry Compote",
    baseToppings: ["strawberries", "pearls"],
    baseColor: "#FDFBF7",
    tags: ["Fruit", "Fresh", "Celebration"],
    price: 1290
  }
];

const FLAVORS = [
  { id: 'vanilla', name: 'Classic Vanilla Bean', surchargePerKg: 0, desc: 'Rich Madagascar vanilla cream' },
  { id: 'chocolate', name: 'Belgian Chocolate Fudge', surchargePerKg: 150, desc: 'Decadent imported dark chocolate' },
  { id: 'red_velvet', name: 'Red Velvet Velvet Cream', surchargePerKg: 200, desc: 'Classic cocoa with rich cream cheese' },
  { id: 'lemon_blueberry', name: 'Zesty Lemon Blueberry', surchargePerKg: 180, desc: 'Tangy lemon zest with fresh berries' },
  { id: 'espresso_mocha', name: 'Espresso Mocha Crunch', surchargePerKg: 160, desc: 'Dipped espresso crumb and coffee cream' },
  { id: 'salted_caramel', name: 'Salted Caramel Praline', surchargePerKg: 150, desc: 'Sweet amber caramel & pecan brittle' },
];

const FROSTINGS = [
  { id: 'buttercream', name: 'Silky Buttercream', flatSurcharge: 0, desc: 'Smooth, fluffy classic finish' },
  { id: 'fondant', name: 'Premium Satin Fondant', flatSurcharge: 250, desc: 'Clean, elegant custom sculpture cover' },
  { id: 'whipped_cream', name: 'Whipped Chantilly', flatSurcharge: 0, desc: 'Light, delicate dairy fresh cream' },
  { id: 'ganache', name: 'Rich Chocolate Ganache', flatSurcharge: 180, desc: 'Silky glaze made of dark pure cocoa' },
];

const FILLINGS = [
  { id: 'none', name: 'Standard Custard / Cream', surchargePerKg: 0 },
  { id: 'choc_chip', name: 'Chocolate Chips & Hot Fudge', surchargePerKg: 60 },
  { id: 'strawberry', name: 'Fresh Strawberry Compote', surchargePerKg: 120 },
  { id: 'oreo', name: 'Crushed Oreo Cookie Creme', surchargePerKg: 70 },
  { id: 'nutella', name: 'Pure Premium Nutella Spread', surchargePerKg: 100 },
  { id: 'hazelnut', name: 'Roasted Hazelnuts & Caramel', surchargePerKg: 90 },
];

const SIZES = [
  { kg: 0.5, label: '0.5 kg (Serves 4 - 6)', basePrice: 500 },
  { kg: 1.0, label: '1.0 kg (Serves 8 - 12)', basePrice: 950 },
  { kg: 1.5, label: '1.5 kg (Serves 12 - 18)', basePrice: 1400 },
  { kg: 2.0, label: '2.0 kg (Serves 16 - 24)', basePrice: 1800 },
  { kg: 3.0, label: '3.0 kg (Serves 25 - 36)', basePrice: 2600 },
];

const SHAPES = [
  { id: 'round', name: 'Charming Round', surcharge: 0, path: 'M 30,50 L 70,50 L 70,80 L 30,80 Z' },
  { id: 'square', name: 'Modern Square', surcharge: 0 },
  { id: 'heart', name: 'Romantic Heart', surcharge: 100 },
  { id: 'hexagon', name: 'Hexagonal Geometric', surcharge: 150 },
];

const TOPPINGS_LIST = [
  { id: 'sprinkles', name: 'Rainbow Sprinkles', price: 30 },
  { id: 'cherries', name: 'Maraschino Glace Cherries', price: 50 },
  { id: 'strawberries', name: 'Fresh Strawberries (Seasonal)', price: 100 },
  { id: 'gold_foil', name: 'Edible 24k Gold Foil Flakes', price: 150 },
  { id: 'ganache_drips', name: 'Dark Chocolate Drips', price: 60 },
  { id: 'macarons', name: 'Mini French Macarons', price: 120 },
  { id: 'pearls', name: 'Glimmering Sugar Pearls', price: 40 },
];

const COLOR_PALETTE = [
  { name: 'Cream White', hex: '#FDFBF7' },
  { name: 'Pastel Rose Pink', hex: '#FFD3DF' },
  { name: 'Warm Honey Gold', hex: '#EEDAA2' },
  { name: 'Soft Peach', hex: '#FAD2C0' },
  { name: 'Rich Chocolate Cocoa', hex: '#4E3629' },
  { name: 'Lavender Sprinkles', hex: '#E2D4F0' },
  { name: 'Mint Meadow Green', hex: '#D2EBD9' },
  { name: 'Sky Velvet Blue', hex: '#CCE2EF' },
];

const OWNER_MOBILE = "7990466936";

// Safe LocalStorage helper to prevent failures in strict iframe privacy sandboxes or incognito modes
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage item retrieval failed:", e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage item save failed:", e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage item removal failed:", e);
    }
  }
};

const DEFAULT_ORDERS: CakeOrder[] = [];

export default function App() {
  // Navigation & Authentication
  const [activeTab, setActiveTab] = useState<'collection' | 'order' | 'my-orders' | 'owner'>('collection');
  const [orders, setOrders] = useState<CakeOrder[]>([]);
  
  // Custom Customer logged in state
  const [userPhone, setUserPhone] = useState<string>('');
  const [userPass, setUserPass] = useState<string>('');
  const [loggedInCustomer, setLoggedInCustomer] = useState<{name: string, phone: string} | null>(null);
  const [custAuthMode, setCustAuthMode] = useState<'login' | 'register'>('login');
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');

  // Signature cakes
  const [signatureCakes, setSignatureCakes] = useState<SignatureCake[]>([]);

  // Reference photos uploader state
  const [customPhotoBase64, setCustomPhotoBase64] = useState<string>('');
  const [customPhotoName, setCustomPhotoName] = useState<string>('');
  
  // Owner Secure Logged In State
  const [ownerPass, setOwnerPass] = useState<string>('');
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [ownerError, setOwnerError] = useState<string>('');

  // ------------------------------------------------------------------------
  // CUSTOM CAKE BUILDER FORM STATE
  // ------------------------------------------------------------------------
  const [builderStep, setBuilderStep] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  
  const [cakeSize, setCakeSize] = useState<number>(1.0);
  const [cakeTiers, setCakeTiers] = useState<number>(1);
  const [cakeShape, setCakeShape] = useState<'round' | 'square' | 'heart' | 'hexagon'>('round');
  const [cakeFlavor, setCakeFlavor] = useState<string>(FLAVORS[0].name);
  const [cakeFrosting, setCakeFrosting] = useState<string>(FROSTINGS[0].name);
  const [cakeFilling, setCakeFilling] = useState<string>(FILLINGS[0].name);
  const [cakeAccentColor, setCakeAccentColor] = useState<string>(COLOR_PALETTE[0].hex);
  const [customAccentText, setCustomAccentText] = useState<string>('');
  const [cakeMessage, setCakeMessage] = useState<string>('');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('2026-05-25');
  const [deliveryTime, setDeliveryTime] = useState<string>('16:00');
  const [submittedOrder, setSubmittedOrder] = useState<CakeOrder | null>(null);

  // Gallery search states
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // ------------------------------------------------------------------------
  // OWNER BOARD FILTERS & MANAGEMENT STATE
  // ------------------------------------------------------------------------
  const [ownerSearch, setOwnerSearch] = useState<string>('');
  const [ownerStatusFilter, setOwnerStatusFilter] = useState<string>('all');
  const [ownerPaymentFilter, setOwnerPaymentFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<CakeOrder | null>(null);
  const [isPrintingReceipt, setIsPrintingReceipt] = useState<boolean>(false);

  // Quick edit values inside detail pane
  const [editStatus, setEditStatus] = useState<CakeOrder['orderStatus']>('pending');
  const [editPayStatus, setEditPayStatus] = useState<CakeOrder['paymentStatus']>('unpaid');
  const [editPaidAmt, setEditPaidAmt] = useState<number>(0);
  const [editPayNotes, setEditPayNotes] = useState<string>('');
  const [editSurcharge, setEditSurcharge] = useState<number>(0);
  const [editDiscountVal, setEditDiscountVal] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  // ------------------------------------------------------------------------
  // INITIAL DATA SYNC
  // ------------------------------------------------------------------------
  useEffect(() => {
    // Clear any previous seed orders if the user wants all removed
    const hasClearedSeed = safeStorage.getItem('bake_theory_orders_removed_all_v2');
    if (!hasClearedSeed) {
      safeStorage.setItem('bake_theory_orders', JSON.stringify([]));
      safeStorage.setItem('bake_theory_orders_removed_all_v2', 'true');
      setOrders([]);
    } else {
      const raw = safeStorage.getItem('bake_theory_orders');
      if (raw) {
        try {
          setOrders(JSON.parse(raw));
        } catch (e) {
          setOrders(DEFAULT_ORDERS);
          safeStorage.setItem('bake_theory_orders', JSON.stringify(DEFAULT_ORDERS));
        }
      } else {
        setOrders(DEFAULT_ORDERS);
        safeStorage.setItem('bake_theory_orders', JSON.stringify(DEFAULT_ORDERS));
      }
    }

    // Try to auto-login customer if session exists
    const storedCust = safeStorage.getItem('bake_theory_cur_customer');
    if (storedCust) {
      try {
        setLoggedInCustomer(JSON.parse(storedCust));
      } catch (e) {}
    }

    // Try to load signature cakes
    const storedCakes = safeStorage.getItem('bake_theory_sig_cakes');
    if (storedCakes) {
      try {
        setSignatureCakes(JSON.parse(storedCakes));
      } catch (e) {
        setSignatureCakes(DEFAULT_SIGNATURE_CAKES);
        safeStorage.setItem('bake_theory_sig_cakes', JSON.stringify(DEFAULT_SIGNATURE_CAKES));
      }
    } else {
      setSignatureCakes(DEFAULT_SIGNATURE_CAKES);
      safeStorage.setItem('bake_theory_sig_cakes', JSON.stringify(DEFAULT_SIGNATURE_CAKES));
    }
  }, []);

  const saveOrders = (updated: CakeOrder[]) => {
    setOrders(updated);
    safeStorage.setItem('bake_theory_orders', JSON.stringify(updated));
  };

  const saveSignatureCakes = (updated: SignatureCake[]) => {
    setSignatureCakes(updated);
    safeStorage.setItem('bake_theory_sig_cakes', JSON.stringify(updated));
  };

  // Helper: Seed Initial Data
  const resetToSeedData = () => {
    if (window.confirm("Are you sure you want to restore the original backup seed data and signature cakes? This will overwrite your current database updates.")) {
      saveOrders(DEFAULT_ORDERS);
      saveSignatureCakes(DEFAULT_SIGNATURE_CAKES);
      setSelectedOrderDetails(null);
    }
  };

  // Filter gallery signature cakes list based on search term and selected tags
  const filteredGalleryCakes = useMemo(() => {
    return signatureCakes.filter(cake => {
      const matchesSearch = cake.name.toLowerCase().includes(gallerySearch.toLowerCase()) || 
                            cake.description.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                            cake.tags.some(t => t.toLowerCase().includes(gallerySearch.toLowerCase())) ||
                            cake.baseFlavor.toLowerCase().includes(gallerySearch.toLowerCase());
      const matchesTag = selectedTag === 'All' || cake.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [signatureCakes, gallerySearch, selectedTag]);

  // ------------------------------------------------------------------------
  // AUTO-COMPUTED CALCULATION OF PRICE IN REAL-TIME
  // ------------------------------------------------------------------------
  const pricingBreakdown = useMemo(() => {
    const chosenSize = SIZES.find(s => s.kg === cakeSize) || SIZES[1];
    const basePrice = chosenSize.basePrice;
    
    const flavorObj = FLAVORS.find(f => f.name === cakeFlavor);
    const flavorSurcharge = (flavorObj?.surchargePerKg || 0) * cakeSize;

    const frostingObj = FROSTINGS.find(fr => fr.name === cakeFrosting);
    const frostingPrice = frostingObj?.flatSurcharge || 0;

    const fillingObj = FILLINGS.find(fi => fi.name === cakeFilling);
    const fillingSurcharge = (fillingObj?.surchargePerKg || 0) * cakeSize;

    const shapeObj = SHAPES.find(s => s.id === cakeShape);
    const shapeSurcharge = shapeObj?.surcharge || 0;

    // Tiers add special structural surcharge
    const tiersSurcharge = cakeTiers === 2 ? 300 : cakeTiers === 3 ? 600 : 0;

    // Toppings summing
    let toppingsSurcharge = 0;
    selectedToppings.forEach(topId => {
      const topDetail = TOPPINGS_LIST.find(t => t.id === topId);
      if (topDetail) {
        toppingsSurcharge += topDetail.price;
      }
    });

    const decorSurcharge = shapeSurcharge + frostingPrice + toppingsSurcharge;

    const deliveryFee = deliveryType === 'delivery' ? 100 : 0;
    const discount = 0; // standard checkout has no discount, owners can apply it later.

    const totalPrice = basePrice + flavorSurcharge + tiersSurcharge + decorSurcharge + deliveryFee - discount;

    return {
      basePrice,
      flavorSurcharge,
      tiersSurcharge,
      decorSurcharge,
      deliveryFee,
      discount,
      totalPrice
    };
  }, [cakeSize, cakeFlavor, cakeFrosting, cakeFilling, cakeTiers, cakeShape, selectedToppings, deliveryType]);

  // ------------------------------------------------------------------------
  // CUSTOMER AUTH ACTIONS
  // ------------------------------------------------------------------------
  const handleCustomerAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (custAuthMode === 'register') {
      if (!regName || !regPhone || !regPass) {
        alert("Please fill in all register fields");
        return;
      }
      const userObj = { name: regName, phone: regPhone };
      // Save customer details under a simple map to simulate DB
      const customers = JSON.parse(safeStorage.getItem('bake_theory_users') || '{}');
      customers[regPhone] = { name: regName, pass: regPass };
      safeStorage.setItem('bake_theory_users', JSON.stringify(customers));
      
      safeStorage.setItem('bake_theory_cur_customer', JSON.stringify(userObj));
      setLoggedInCustomer(userObj);
      
      // Auto-populate guest fields with user data
      setGuestName(regName);
      setGuestPhone(regPhone);
      
      // Clean up fields
      setRegName(''); setRegPhone(''); setRegPass('');
    } else {
      if (!userPhone || !userPass) {
        alert("Please enter phone and password pin");
        return;
      }
      const customers = JSON.parse(safeStorage.getItem('bake_theory_users') || '{}');
      // Secret backdoor for testing guest: password '1234' on any custom registered user or check seed
      const userRecord = customers[userPhone];
      if (userRecord && userRecord.pass === userPass) {
        const userObj = { name: userRecord.name, phone: userPhone };
        safeStorage.setItem('bake_theory_cur_customer', JSON.stringify(userObj));
        setLoggedInCustomer(userObj);
        
        // Auto populate builder with user details
        setGuestName(userRecord.name);
        setGuestPhone(userPhone);
      } else if (userPhone === "9876543210" && userPass === "1234") {
        // Preset client seed testing bypass
        const userObj = { name: "Hargunjit Singh", phone: "9876543210" };
        safeStorage.setItem('bake_theory_cur_customer', JSON.stringify(userObj));
        setLoggedInCustomer(userObj);
        setGuestName(userObj.name);
        setGuestPhone(userObj.phone);
      } else {
        alert("Invalid Phone Number or Password Pin! Try registering a new account first.");
      }
    }
  };

  const handleCustomerLogout = () => {
    safeStorage.removeItem('bake_theory_cur_customer');
    setLoggedInCustomer(null);
    setUserPhone('');
    setUserPass('');
  };

  // ------------------------------------------------------------------------
  // CUSTOMER BUILDER CHECKOUT
  // ------------------------------------------------------------------------
  const submitCustomOrder = () => {
    // Collect Name & Contact details
    const finalName = loggedInCustomer ? loggedInCustomer.name : guestName;
    const finalPhone = loggedInCustomer ? loggedInCustomer.phone : guestPhone;
    const finalEmail = guestEmail || `${finalName.toLowerCase().replace(/\s/g, '')}@example.com`;

    if (!finalName || !finalPhone) {
      alert("Please ensure Name and Phone number are entered in the final step!");
      setBuilderStep(4);
      return;
    }

    // Generate new ID
    const nextNum = 1001 + orders.length;
    const orderId = `BT-${nextNum}`;

    const newOrder: CakeOrder = {
      id: orderId,
      customerName: finalName,
      customerPhone: finalPhone,
      customerEmail: finalEmail,
      pickupOrDelivery: deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
      deliveryDate,
      deliveryTime,
      sizeKg: cakeSize,
      tiers: cakeTiers,
      shape: cakeShape,
      flavor: cakeFlavor,
      frosting: cakeFrosting,
      filling: cakeFilling,
      accentColor: customAccentText || cakeAccentColor,
      customMessage: cakeMessage,
      toppings: selectedToppings,
      specialNotes: specialNotes,
      
      // Pricing
      basePrice: pricingBreakdown.basePrice,
      flavorSurcharge: pricingBreakdown.flavorSurcharge,
      tiersSurcharge: pricingBreakdown.tiersSurcharge,
      decorSurcharge: pricingBreakdown.decorSurcharge,
      deliveryFee: pricingBreakdown.deliveryFee,
      discount: 0,
      totalPrice: pricingBreakdown.totalPrice,
      
      paymentStatus: 'unpaid',
      paymentMethod: 'upi',
      depositAmount: 0,
      amountPaid: 0,
      
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      referencePhotoBase64: customPhotoBase64 || undefined,
      referencePhotoName: customPhotoName || undefined
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    setSubmittedOrder(newOrder);
    setBuilderStep(5); // Show congratulations receipt
  };

  // Reset order generator to build a second cake
  const resetOrderBuilder = () => {
    setBuilderStep(1);
    setCakeSize(1.0);
    setCakeTiers(1);
    setCakeShape('round');
    setCakeFlavor(FLAVORS[0].name);
    setCakeFrosting(FROSTINGS[0].name);
    setCakeFilling(FILLINGS[0].name);
    setCakeAccentColor(COLOR_PALETTE[0].hex);
    setCustomAccentText('');
    setCakeMessage('');
    setSelectedToppings([]);
    setSpecialNotes('');
    setDeliveryType('pickup');
    setDeliveryAddress('');
    setSubmittedOrder(null);
    setCustomPhotoBase64('');
    setCustomPhotoName('');
  };

  const handleQuickSelectCake = (cake: SignatureCake) => {
    setCakeSize(cake.baseSize);
    setCakeTiers(cake.baseTiers);
    setCakeShape(cake.baseShape);
    setCakeFlavor(cake.baseFlavor);
    setCakeFrosting(cake.baseFrosting);
    setCakeFilling(cake.baseFilling);
    setCakeAccentColor(cake.baseColor);
    setSelectedToppings(cake.baseToppings);
    setSpecialNotes(`Starting from the base signature design: "${cake.name}". Adjust anything you like!`);
    setActiveTab('order');
    setBuilderStep(2); // Take them directly to tastes and styling!
  };

  // Drag & drop file upload state/handlers for customer reference photos
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomPhotoBase64(event.target.result as string);
        setCustomPhotoName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // ------------------------------------------------------------------------
  // OWNER AUTH ACTIONS
  // ------------------------------------------------------------------------
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure credentials requested: Owner credential with user's requested number hint
    if (ownerPass === 'bake7990' || ownerPass === '7990466936') {
      setIsOwnerAuthenticated(true);
      setOwnerError('');
    } else {
      setOwnerError("Incorrect owner passcode! Access denied.");
    }
  };

  // ------------------------------------------------------------------------
  // OWNER ACTION: UPDATE STATUS, PAYMENTS, SURCHARGES
  // ------------------------------------------------------------------------
  const handleSelectOrderAndPopulate = (ord: CakeOrder) => {
    setSelectedOrderDetails(ord);
    setEditStatus(ord.orderStatus);
    setEditPayStatus(ord.paymentStatus);
    setEditPaidAmt(ord.amountPaid);
    setEditPayNotes(ord.paymentNotes || '');
    setEditSurcharge(ord.decorSurcharge);
    setEditDiscountVal(ord.discount || 0);
    setEditNotes(ord.specialNotes || '');
  };

  const handleSaveOwnerSettings = () => {
    if (!selectedOrderDetails) return;

    // Recalculate price in case discount/surcharge updated manually by owner
    const itemIdx = orders.findIndex(o => o.id === selectedOrderDetails.id);
    if (itemIdx === -1) return;

    const baseItem = orders[itemIdx];

    const currentTotal = baseItem.basePrice + baseItem.flavorSurcharge + baseItem.tiersSurcharge + editSurcharge + baseItem.deliveryFee - editDiscountVal;

    const updatedItem: CakeOrder = {
      ...baseItem,
      orderStatus: editStatus,
      paymentStatus: editPayStatus,
      amountPaid: Number(editPaidAmt),
      decorSurcharge: Number(editSurcharge),
      discount: Number(editDiscountVal),
      totalPrice: currentTotal,
      paymentNotes: editPayNotes,
      specialNotes: editNotes
    };

    const newOrders = [...orders];
    newOrders[itemIdx] = updatedItem;
    saveOrders(newOrders);
    setSelectedOrderDetails(updatedItem);
    alert(`Order ${updatedItem.id} updated and saved successfully!`);
  };

  // Quick Action Utilities for whatsapp links and text messaging layout
  const getWhatsAppLink = (ord: CakeOrder) => {
    const message = `Halo ${ord.customerName}, this is Bake Theory Bakery 🎂! Regarding your Custom Cake Order #${ord.id} (${ord.sizeKg}kg ${ord.flavor} Cake):\n\n🍰 Order Status: *${ord.orderStatus.toUpperCase()}*\n💸 Payment Required: ₹${ord.totalPrice}\n💰 Amount Paid: ₹${ord.amountPaid}\n\nCan we confirm authorization of details on WhatsApp? Thanks!`;
    return `https://wa.me/91${ord.customerPhone}?text=${encodeURIComponent(message)}`;
  };

  const generateWhatsAppCheckoutLink = (ord: CakeOrder) => {
    const text = `Hi, I just submitted a new custom cake order on Bake Theory! \n\n📋 *Order ID*: ${ord.id}\n👤 *Name*: ${ord.customerName}\n🎂 *Flavor*: ${ord.flavor}\n💫 *Specs*: ${ord.sizeKg}kg - ${ord.tiers} Tier - ${ord.shape} shape\n💸 *Total Quote*: ₹${ord.totalPrice}\n\nPlease share details for making the deposit payment!`;
    return `https://wa.me/91${OWNER_MOBILE}?text=${encodeURIComponent(text)}`;
  };

  // Filter calculations
  const filteredOrdersForOwner = useMemo(() => {
    return orders.filter(ord => {
      const matchSearch = 
        ord.customerName.toLowerCase().includes(ownerSearch.toLowerCase()) || 
        ord.customerPhone.includes(ownerSearch) ||
        ord.id.toLowerCase().includes(ownerSearch.toLowerCase()) ||
        ord.flavor.toLowerCase().includes(ownerSearch.toLowerCase());
      
      const matchStatus = ownerStatusFilter === 'all' || ord.orderStatus === ownerStatusFilter;
      const matchPayment = ownerPaymentFilter === 'all' || ord.paymentStatus === ownerPaymentFilter;
      
      return matchSearch && matchStatus && matchPayment;
    });
  }, [orders, ownerSearch, ownerStatusFilter, ownerPaymentFilter]);

  // Financial Stats Sums
  const ownerStats = useMemo(() => {
    let totalCakes = 0;
    let expectedRevenue = 0;
    let totalCollected = 0;
    let outstandingReceivables = 0;

    orders.forEach(o => {
      if (o.orderStatus !== 'cancelled') {
        totalCakes += 1;
        expectedRevenue += o.totalPrice;
        totalCollected += o.amountPaid;
        outstandingReceivables += (o.totalPrice - o.amountPaid);
      }
    });

    return {
      totalCakes,
      expectedRevenue,
      totalCollected,
      outstandingReceivables
    };
  }, [orders]);

  // Get current list of orders belonging to logged-in user
  const loggedInCustomerOrders = useMemo(() => {
    if (!loggedInCustomer) return [];
    return orders.filter(ord => ord.customerPhone === loggedInCustomer.phone);
  }, [orders, loggedInCustomer]);

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#2c221e] antialiased flex flex-col font-sans">
      
      {/* HEADER BANNER */}
      <header className="bg-white border-b border-[#ebdcd0] sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand / Human Labels */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md">
              <Cake className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif tracking-tight text-[#422210]">Bake Theory</h1>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase">
                  Home Kitchen
                </span>
              </div>
              <p className="text-xs text-amber-800/80">Premium Custom Cakes • Home Baked with Love & Science</p>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600 bg-[#fdf9f4] p-2 rounded-lg border border-[#f3e4da]">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Order Desk Call/WA: <strong className="text-amber-900">+91 {OWNER_MOBILE}</strong></span>
            </div>
          </div>

          {/* Core App Navigation Tabs */}
          <nav className="flex flex-wrap gap-1 bg-amber-50/70 p-1 rounded-lg border border-amber-100/80">
            <button
              id="tab-collection"
              onClick={() => setActiveTab('collection')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'collection' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-[#5a4238] hover:bg-amber-100/50'
              }`}
            >
              <Cake className="w-4 h-4" />
              <span>Cakes Gallery</span>
            </button>
            <button
              id="tab-order"
              onClick={() => setActiveTab('order')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'order' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-[#5a4238] hover:bg-amber-100/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Custom Designer</span>
            </button>
            <button
              id="tab-tracking"
              onClick={() => setActiveTab('my-orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'my-orders' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-[#5a4238] hover:bg-amber-100/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Track Orders {loggedInCustomerOrders.length > 0 && `(${loggedInCustomerOrders.length})`}</span>
            </button>
            <button
              id="tab-owner"
              onClick={() => setActiveTab('owner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'owner' 
                  ? 'bg-[#3b271d] text-white shadow-xs' 
                  : 'text-[#5a4238] hover:bg-amber-100/50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Owner Access</span>
            </button>
          </nav>

        </div>
      </header>

      {/* SUB-HEADER USER WELCOME BAR */}
      {loggedInCustomer && activeTab !== 'owner' && (
        <div className="bg-amber-100/70 py-1.5 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-amber-950 font-medium">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>Loged In Customer: <strong className="text-amber-900">{loggedInCustomer.name}</strong> ({loggedInCustomer.phone})</span>
            </div>
            <button 
              onClick={handleCustomerLogout}
              className="hover:underline flex items-center gap-1 text-red-700 bg-white/60 px-2 py-0.5 rounded border border-amber-200"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT GATEWAY CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6 w-full">

        {/* ========================================================== */}
        {/* NEW TAB: CAKES COLLECTION SHOWROOM */}
        {/* ========================================================== */}
        {activeTab === 'collection' && (
          <div className="space-y-6 animate-fade-in" id="cakes-showroom-arena">
            
            {/* Showroom Header Card */}
            <div className="bg-gradient-to-br from-amber-50 to-[#fbf1e7] rounded-2xl border border-amber-100 p-6 sm:p-8 relative overflow-hidden shadow-2xs">
              <div className="max-w-2xl relative z-10 space-y-3">
                <span className="inline-block bg-amber-200 text-amber-900 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">
                  Signature Gallery
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#422210]">Explore Our Bakehouse Creations</h2>
                <p className="text-sm text-amber-950/80 leading-relaxed">
                  Every slice of Bake Theory contains balanced food science and deep home bakery love. Browse our signature designs below. Select any design to adjust its size, shape, flavors, or custom messaging!
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveTab('order')}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Custom Designer from scratch</span>
                  </button>
                  <a
                    href={`https://wa.me/917990466936?text=Hello%20Bake%20Theory!%20I%20have%20an%20idea%20for%20a%20delicious%20custom%20cake%20order.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Discuss on WhatsApp (+91 7990466936)</span>
                  </a>
                </div>
              </div>
              {/* Abstract decorative graphic */}
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
                <Cake className="w-64 h-64 text-amber-900" />
              </div>
            </div>

            {/* Catalog search filter panel row */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-3xs flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Dynamic tag selector row */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {['All', 'Birthday', 'Anniversary', 'Chocolate', 'Romance', 'Kids', 'Elegant'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                      selectedTag === tag
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-[#5a4238]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Text Search Panel */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search recipes, flavors..."
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>

            </div>

            {/* Gallery card Grid */}
            {filteredGalleryCakes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleryCakes.map((cake) => (
                  <div key={cake.id} className="bg-white rounded-2xl border border-gray-150 shadow-3xs hover:shadow-2xs transition-all overflow-hidden flex flex-col group h-full">
                    {/* Cake Photo wrapper */}
                    <div className="relative aspect-video w-full bg-amber-50/50 overflow-hidden shrink-0">
                      <img 
                        src={cake.image} 
                        alt={cake.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Standard fallback to high-quality unsplash placeholder
                          e.currentTarget.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1">
                        {cake.tags.map(t => (
                          <span key={t} className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-amber-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        {cake.id}
                      </div>
                    </div>

                    {/* Cake metadata details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-900 font-serif text-lg leading-snug group-hover:text-amber-800 transition-colors">{cake.name}</h3>
                          <span className="text-lg font-bold font-mono text-amber-800 tracking-tight shrink-0">₹{cake.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{cake.description}</p>
                      </div>

                      {/* Specs pills summary of this signature item */}
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-gray-500 grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider block font-bold text-gray-400">Baseline Sizing</span>
                          <strong className="text-gray-800 text-xs">{cake.baseSize} Kg • {cake.baseTiers} Tier{cake.baseTiers > 1 ? 's' : ''}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider block font-bold text-gray-400">Frosting Style</span>
                          <strong className="text-gray-800 text-xs">{cake.baseFrosting}</strong>
                        </div>
                        <div className="col-span-2 border-t border-gray-100 pt-1.5">
                          <span className="text-[9px] uppercase tracking-wider block font-bold text-gray-400">Signature Flavor</span>
                          <strong className="text-[#3b271d] text-xs font-semibold">{cake.baseFlavor}</strong>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <button
                        onClick={() => handleQuickSelectCake(cake)}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Customize & Quick-Order</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-gray-800">No matching creations found</h3>
                  <p className="text-xs text-gray-500 mt-1">Try resetting your filters or search terms for broader results.</p>
                </div>
                <button
                  onClick={() => { setGallerySearch(''); setSelectedTag('All'); }}
                  className="px-4 py-2 bg-amber-100 font-semibold text-amber-950 rounded-lg text-xs"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Helpful upload explanation card */}
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 max-w-4xl mx-auto">
              <span className="text-base">💡</span>
              <div className="text-xs text-amber-950">
                <strong className="text-amber-900">Have your own physical custom cake photo?</strong> We love baking from your visual references (shapes, custom drawings, internet inspirations)! Just click the <strong>Custom Designer</strong> tab above, configure your general sizing/flavor preferences, and <strong>drag-and-drop or select your physical reference image</strong> on Step 3 (Design Aesthetics). Our design team will formulate your custom quote easily!
              </div>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 1: CUSTOM CAKE ORDER BUILDER */}
        {/* ========================================================== */}
        {activeTab === 'order' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* STAGE & FORM INPUT LEFT HAND CRADLE (Col-span 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-100 shadow-sm p-4 sm:p-6">
              
              {/* Process Bar Stepper Row */}
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <span className="text-sm font-bold tracking-tight text-[#4a2e1c]">
                  {builderStep <= 4 ? `Step ${builderStep} of 4: ` : "Order Complete! 🎉"} 
                  <span className="text-gray-500 font-normal">
                    {builderStep === 1 && "Cake Dimensions"}
                    {builderStep === 2 && "Flavors & Fillings"}
                    {builderStep === 3 && "Design Aesthetics & Text message"}
                    {builderStep === 4 && "Contact Details & Pickup Method"}
                  </span>
                </span>
                
                {/* Visual Step Pill Dots */}
                {builderStep <= 4 && (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(sNum => (
                      <button
                        key={sNum}
                        onClick={() => {
                          // Allow jumping back freely to edit, but check credentials step 4 validation
                          if (sNum < builderStep) setBuilderStep(sNum);
                        }}
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          builderStep === sNum 
                            ? 'bg-amber-600 text-white ring-2 ring-amber-100' 
                            : sNum < builderStep 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-gray-100 text-gray-400'
                        }`}
                        title={`Go to step ${sNum}`}
                      >
                        {sNum}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* STEP 1: DIMENSIONS & SHAPE SCALE */}
              {builderStep === 1 && (
                <div className="space-y-5">
                  <h3 className="text-md font-bold text-gray-800 border-l-4 border-amber-500 pl-2">1. Select Cake Weight & Sizing</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SIZES.map(s => (
                      <button
                        key={s.kg}
                        onClick={() => setCakeSize(s.kg)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative ${
                          cakeSize === s.kg 
                            ? 'border-amber-500 bg-amber-50/40 shadow-xs' 
                            : 'border-gray-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div className="font-bold text-gray-900">{s.label}</div>
                        <div className="text-xs text-gray-500 mt-1">Excellent for general gatherings.</div>
                        <div className="text-sm font-bold text-amber-700 mt-1">Base Price: ₹{s.basePrice}</div>
                        {cakeSize === s.kg && (
                          <div className="absolute right-3 top-3 bg-amber-500 text-white rounded-full p-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <hr className="border-gray-100 my-4" />

                  {/* Stacking Tiers */}
                  <h3 className="text-md font-bold text-gray-800">2. Select Cake Layers & Tiers</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(t => (
                      <button
                        key={t}
                        onClick={() => {
                          setCakeTiers(t);
                          // Force sensible size limit compatibility
                          if (t > 1 && cakeSize < 1.0) {
                            setCakeSize(1.5);
                          }
                        }}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          cakeTiers === t 
                            ? 'border-amber-500 bg-amber-50/40 text-[#422210] font-bold' 
                            : 'border-gray-200 hover:border-amber-200'
                        }`}
                      >
                        <div className="text-md">{t} Tier{t > 1 ? 's' : ''}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {t === 1 && "Standard Flat"}
                          {t === 2 && "+₹300 (Twin Tiers)"}
                          {t === 3 && "+₹600 (Three Tiers)"}
                        </div>
                      </button>
                    ))}
                  </div>
                  {cakeTiers > 1 && cakeSize === 0.5 && (
                    <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>Note: A 0.5kg cake is too small for multiple tiers. Weight was automatically scaled up to standard tier requirements.</span>
                    </div>
                  )}

                  <hr className="border-gray-100 my-4" />

                  {/* Geometrics Shape Preference */}
                  <h3 className="text-md font-bold text-gray-800">3. Cake Base Outline Shape</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SHAPES.map(sh => (
                      <button
                        key={sh.id}
                        onClick={() => setCakeShape(sh.id as any)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          cakeShape === sh.id 
                            ? 'border-amber-500 bg-amber-50/40 text-amber-900 font-bold' 
                            : 'border-gray-100 hover:border-amber-200'
                        }`}
                      >
                        <div className="capitalize text-sm">{sh.name.replace('Charming ', '').replace('Romantic ', '').replace('Modern ', '')}</div>
                        <div className="text-[10px] text-amber-800 font-medium">
                          {sh.surcharge > 0 ? `+₹${sh.surcharge}` : 'Free'}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Continue Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setBuilderStep(2)}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1"
                    >
                      <span>Flavors & Fillings</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: FLAVOR PROFILE & SATIN CREAM FILLERS */}
              {builderStep === 2 && (
                <div className="space-y-5">
                  <h3 className="text-md font-bold text-gray-800 border-l-4 border-amber-500 pl-2">Select Taste Formulation</h3>
                  
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {FLAVORS.map(fl => (
                      <button
                        key={fl.id}
                        onClick={() => setCakeFlavor(fl.name)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          cakeFlavor === fl.name 
                            ? 'border-amber-500 bg-amber-50/30' 
                            : 'border-gray-100 hover:border-amber-100'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-gray-900">{fl.name}</div>
                          <div className="text-xs text-gray-500">{fl.desc}</div>
                        </div>
                        <div className="text-xs font-bold text-amber-800 text-right shrink-0">
                          {fl.surchargePerKg > 0 ? `+₹${fl.surchargePerKg}/kg` : 'Standard'}
                        </div>
                      </button>
                    ))}
                  </div>

                  <hr className="border-gray-100 my-4" />

                  <h3 className="text-md font-bold text-gray-800">Outer Frosting Texture</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FROSTINGS.map(fr => (
                      <button
                        key={fr.id}
                        onClick={() => setCakeFrosting(fr.name)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          cakeFrosting === fr.name 
                            ? 'border-amber-500 bg-amber-50/40' 
                            : 'border-gray-100 hover:border-amber-100'
                        }`}
                      >
                        <div className="text-sm font-bold text-gray-900">{fr.name}</div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">{fr.desc}</div>
                        <div className="text-xs font-bold text-amber-800 mt-0.5">
                          {fr.flatSurcharge > 0 ? `+₹${fr.flatSurcharge}` : 'No extra cost'}
                        </div>
                      </button>
                    ))}
                  </div>

                  <hr className="border-gray-100 my-4" />

                  <h3 className="text-md font-bold text-gray-800">Rich Core Filling Layer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FILLINGS.map(fi => (
                      <button
                        key={fi.id}
                        onClick={() => setCakeFilling(fi.name)}
                        className={`p-2.5 rounded-lg border text-left transition-all flex justify-between items-center ${
                          cakeFilling === fi.name 
                            ? 'border-amber-500 bg-amber-50/40' 
                            : 'border-gray-100 hover:border-amber-100'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{fi.name.replace('Premium ', '')}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-800">
                          {fi.surchargePerKg > 0 ? `+₹${fi.surchargePerKg}/kg` : 'Standard'}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Stepper controls */}
                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setBuilderStep(1)}
                      className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBuilderStep(3)}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1"
                    >
                      <span>Design Aesthetics</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PIPING ACCENTS, COLOR SHADES & CALLIGRAPHY */}
              {builderStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-md font-bold text-[#422210] border-l-4 border-amber-500 pl-2">Pastel Base Frosting Shade</h3>
                  <p className="text-xs text-gray-500">Pick an accent color frosting. This updates your live interactive cake canvas!</p>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {COLOR_PALETTE.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => {
                          setCakeAccentColor(c.hex);
                          setCustomAccentText('');
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative ${
                          cakeAccentColor === c.hex && !customAccentText 
                            ? 'border-amber-600 scale-110 shadow-md' 
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {cakeAccentColor === c.hex && !customAccentText && (
                          <div className="bg-amber-600 text-white rounded-full p-0.5 scale-90">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Manual hex or text input */}
                  <div className="flex items-center gap-2 pt-1 h-9">
                    <span className="text-xs text-gray-500 shrink-0">Custom Color:</span>
                    <input 
                      type="text"
                      className="border border-gray-200 rounded px-2 py-0.5 text-xs bg-white w-full max-w-44 focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. Lavender Blush, Lavender"
                      value={customAccentText}
                      onChange={(e) => setCustomAccentText(e.target.value)}
                    />
                  </div>

                  <hr className="border-gray-100 my-2" />

                  {/* Writing Message on Cake */}
                  <h3 className="text-md font-bold text-gray-800">Calligraphy Message on Cake</h3>
                  <p className="text-xs text-gray-500">Elegantly written on the top tier cake face. Max 35 chars.</p>
                  <input
                    type="text"
                    maxLength={35}
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    placeholder="Happy Birthday Hargunjit! (or leave blank)"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-hidden focus:ring-1 focus:ring-amber-500"
                  />

                  <hr className="border-gray-100 my-2" />

                  {/* Add Toppings Checklist */}
                  <h3 className="text-md font-bold text-gray-800">Add Design Accents (Multiple Selection)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TOPPINGS_LIST.map(topping => {
                      const isSelected = selectedToppings.includes(topping.id);
                      return (
                        <button
                          key={topping.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedToppings(selectedToppings.filter(t => t !== topping.id));
                            } else {
                              setSelectedToppings([...selectedToppings, topping.id]);
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50/40 shadow-2xs' 
                              : 'border-gray-100 hover:border-amber-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span className="font-medium text-gray-800">{topping.name}</span>
                          </div>
                          <span className="text-amber-800 font-bold">+₹{topping.price}</span>
                        </button>
                      );
                    })}
                  </div>

                  <hr className="border-gray-100 my-2" />

                  {/* Production specifications instruction */}
                  <h3 className="text-sm font-bold text-gray-800">Special Baking & Design Instructions</h3>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Please make it 100% vegetarian eggless, less sugary cream, golden highlights, etc."
                    className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 outline-hidden"
                  />

                  <hr className="border-gray-100 my-2" />

                  {/* Reference design photo upload */}
                  <h3 className="text-sm font-bold text-[#422210]">Optional Design Reference Photo</h3>
                  <p className="text-xs text-gray-500">
                    Already found a gorgeous design online? Drag-and-drop or select it below, and we'll bake it for you!
                  </p>

                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center transition-all ${
                      dragActive 
                        ? 'border-amber-600 bg-amber-50/50' 
                        : customPhotoBase64 
                          ? 'border-emerald-500 bg-emerald-50/10' 
                          : 'border-gray-300 hover:border-amber-400 bg-gray-50/30'
                    }`}
                  >
                    {customPhotoBase64 ? (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img 
                            src={customPhotoBase64} 
                            alt="Reference reference" 
                            className="h-28 object-contain rounded-lg border border-emerald-200 shadow-sm mx-auto" 
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => { setCustomPhotoBase64(''); setCustomPhotoName(''); }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-sm hover:bg-red-700 text-xs font-bold w-5 h-5 flex items-center justify-center"
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Photo Linked Successfully: {customPhotoName}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-2">
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <label className="cursor-pointer block">
                          <span className="text-xs font-semibold text-amber-950 underline hover:text-amber-700">Click to browse your files</span>
                          <span className="text-xs text-gray-500 block mt-1">or drag-and-drop your image file here</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden" 
                          />
                        </label>
                      </>
                    )}
                  </div>

                  {/* Navigation controls */}
                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => setBuilderStep(2)}
                      className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBuilderStep(4)}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1"
                    >
                      <span>Delivery Information</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT INFORMATION & DELIVERY METHOD */}
              {builderStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-md font-bold text-gray-800 border-l-4 border-amber-500 pl-2">Customer Credentials</h3>
                  <p className="text-xs text-amber-900 border border-amber-200 bg-amber-50/50 rounded-lg p-2.5 mb-2">
                    🌟 <strong>Protip:</strong> Login or simple registers from the tab at top to auto-fill details, or proceed below and your account gets created automatically with the order!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hargunjit Singh"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        disabled={!!loggedInCustomer}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-amber-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp / Call Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210 (10 digit)"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        disabled={!!loggedInCustomer}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-amber-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100 my-2" />

                  {/* Delivery vs Pickup */}
                  <h3 className="text-md font-bold text-gray-800">Hand-off Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                        deliveryType === 'pickup' 
                          ? 'border-amber-600 bg-amber-50/40 text-amber-950 font-bold' 
                          : 'border-gray-200 hover:border-amber-100'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5 text-amber-600" />
                      <span className="text-xs">Self-Pickup at Bakery</span>
                      <span className="text-[10px] text-green-700 font-normal">Free Hand-off</span>
                    </button>
                    <button
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                        deliveryType === 'delivery' 
                          ? 'border-amber-600 bg-amber-50/40 text-amber-950 font-bold' 
                          : 'border-gray-200 hover:border-amber-100'
                      }`}
                    >
                      <Truck className="w-5 h-5 text-amber-600" />
                      <span className="text-xs">Secure Home Delivery</span>
                      <span className="text-[10px] text-amber-800 font-normal">+₹100 Flat Charge</span>
                    </button>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-600">Full Delivery Destination Address</label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Door / Apartment Number, Street Details, Landmark, Pin"
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  )}

                  <hr className="border-gray-100 my-2" />

                  {/* Target Delivery Timeline */}
                  <h3 className="text-md font-bold text-gray-800">Timeline Schedule</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Target Delivery Date</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Target Delivery Time</label>
                      <input
                        type="time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Pricing alert note */}
                  <p className="text-[10px] text-gray-500 italic text-center">
                    Note: Review your custom specifications and prices in the summary breakdown!
                  </p>

                  {/* Submit buttons */}
                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => setBuilderStep(3)}
                      className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={submitCustomOrder}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1"
                    >
                      <Check className="w-5 h-5" />
                      <span>Place Custom Order</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: ORDER SUCCESS CARD RECEIPT WITH WHATSAPP LINK */}
              {builderStep === 5 && submittedOrder && (
                <div className="py-6 text-center space-y-5 animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-sm">
                    <Check className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 font-serif">Order Proposal Sent!</h2>
                    <p className="text-sm text-amber-800 mt-1">
                      Your Order ID is <strong className="text-amber-950 font-mono text-base bg-amber-100/60 px-2 py-0.5 rounded">{submittedOrder.id}</strong>
                    </p>
                  </div>

                  <div className="max-w-md mx-auto p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-left space-y-3">
                    <p className="text-xs text-gray-700 leading-relaxed text-center">
                      🌟 <strong>Important Next Action Step:</strong> Home bakeries coordinate custom cake aesthetics and references directly on WhatsApp! Click the button below to text us instantly.
                    </p>
                    
                    <a
                      href={generateWhatsAppCheckoutLink(submittedOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-sm"
                    >
                      <MessageSquare className="w-5 h-5 fill-white" />
                      <span>Chat with Baker to Confirm Design</span>
                    </a>

                    <div className="bg-white p-3 rounded-lg border border-amber-100 text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Bake Base Weight:</span>
                        <span className="font-bold">{submittedOrder.sizeKg} kg ({submittedOrder.tiers} Tiers)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cake Flavor:</span>
                        <span className="font-bold">{submittedOrder.flavor}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-1 text-gray-800">
                        <span>Grand Total Quote:</span>
                        <span className="font-bold text-amber-700">₹{submittedOrder.totalPrice}</span>
                      </div>
                      {submittedOrder.referencePhotoBase64 && (
                        <div className="border-t border-gray-150 pt-2.5 mt-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Attached Reference Photo</span>
                          <img 
                            src={submittedOrder.referencePhotoBase64} 
                            alt="Reference attachment" 
                            className="h-24 w-auto object-contain rounded border border-gray-200 shadow-3xs" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={resetOrderBuilder}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                  >
                    Bake Another Custom Cake
                  </button>
                </div>
              )}

            </div>

            {/* LIVE DYNAMIC 2D VECTOR CAKE VISUALIZER & DYNAMIC ESTIMATOR RECEIPTS RIGHT HAND (Col-span 5) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* INTERACTIVE CAKE DOCK */}
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-wider text-amber-600 uppercase mb-3 text-center block">
                  Interactive Cake Canvas (Live Customizer)
                </span>
                
                {/* Visual rendering of customizable cake using SVGs based on state */}
                <div className="w-full max-w-64 aspect-square bg-amber-50/30 rounded-xl relative flex items-center justify-center p-4 border border-amber-100/40">
                  
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                    
                    {/* Background decoration cake platform */}
                    <ellipse cx="100" cy="170" rx="80" ry="12" fill="#EEDAC5" opacity="0.8" />
                    <ellipse cx="100" cy="168" rx="80" ry="8" fill="#FFFFFF" />
                    <rect x="25" y="150" width="150" height="15" rx="5" fill="#EADBCE" />

                    {/* RENDERING CAKE TIERS STACK */}

                    {/* Tier 1 (Bottom Tier) - Present in all configs */}
                    <g>
                      {/* Shape visual changes based on selected shape */}
                      {cakeShape === 'heart' ? (
                        // Heart bottom tier layout
                        <path d="M 40,110 C 20,110 20,150 100,150 C 180,150 180,110 160,110 Z" fill={cakeAccentColor || '#FDFBF7'} opacity="0.9" stroke="#EADBCE" strokeWidth="1" />
                      ) : cakeShape === 'square' ? (
                        <>
                          <rect x="40" y="110" width="120" height="40" fill={cakeAccentColor || '#FDFBF7'} stroke="#E5D0C0" strokeWidth="1" />
                          <line x1="100" y1="110" x2="100" y2="150" stroke="#000000" strokeWidth="0.5" opacity="0.1" />
                        </>
                      ) : cakeShape === 'hexagon' ? (
                        <polygon points="40,120 70,110 130,110 160,120 160,150 130,150 70,150 40,150" fill={cakeAccentColor || '#FDFBF7'} stroke="#E5D0C0" strokeWidth="1" />
                      ) : (
                        // Default Charming Round Column
                        <rect x="40" y="110" width="120" height="40" rx="8" fill={cakeAccentColor || '#FDFBF7'} stroke="#E5D0C0" strokeWidth="1" />
                      )}

                      {/* Accent details - ganache dips */}
                      {selectedToppings.includes('ganache_drips') && (
                        <path d="M 40,110 c 15,10 20,-2 30,8 c 12,12 18,2 30,10 c 10,-8 15,6 30,6 c 15,-10 20,5 30,-14" fill="none" stroke="#3E2723" strokeWidth="4.5" strokeLinecap="round" />
                      )}

                      {/* Sprinkles on Bottom Tier */}
                      {selectedToppings.includes('sprinkles') && (
                        <g opacity="0.7">
                          <circle cx="55" cy="125" r="1.5" fill="#FF5252" />
                          <circle cx="70" cy="135" r="1.5" fill="#FFEB3B" />
                          <circle cx="95" cy="120" r="1.5" fill="#2196F3" />
                          <circle cx="120" cy="140" r="1.5" fill="#E91E63" />
                          <circle cx="135" cy="125" r="1.5" fill="#4CAF50" />
                          <circle cx="145" cy="135" r="1.5" fill="#9C27B0" />
                        </g>
                      )}
                    </g>

                    {/* Tier 2 (Middle Tier if tiers >= 2) */}
                    {cakeTiers >= 2 && (
                      <g>
                        {cakeShape === 'heart' ? (
                          <path d="M 60,75 C 45,75 45,110 100,110 C 155,110 155,75 140,75 Z" fill={cakeAccentColor || '#FDFBF7'} stroke="#DCC7B7" strokeWidth="1" />
                        ) : cakeShape === 'square' ? (
                          <rect x="60" y="75" width="80" height="35" fill={cakeAccentColor || '#FDFBF7'} stroke="#DCC7B7" strokeWidth="1" />
                        ) : cakeShape === 'hexagon' ? (
                          <polygon points="60,82 80,75 120,75 140,82 140,110 120,110 80,110 60,110" fill={cakeAccentColor || '#FDFBF7'} stroke="#DCC7B7" strokeWidth="1" />
                        ) : (
                          <rect x="60" y="75" width="80" height="35" rx="6" fill={cakeAccentColor || '#FDFBF7'} stroke="#DCC7B7" strokeWidth="1" />
                        )}

                        {/* Middle drips */}
                        {selectedToppings.includes('ganache_drips') && (
                          <path d="M 60,75 c 10,7 15,-2 20,6 c 10,10 15,2 20,8 c 10,-8 15,4 20,4 c 10,-8 15,4 20,-10" fill="none" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
                        )}

                        {/* Pearls highlighting on middle border */}
                        {selectedToppings.includes('pearls') && (
                          <g fill="#FFFDE7" stroke="#FFF9C4" strokeWidth="0.5">
                            <circle cx="65" cy="77" r="2" />
                            <circle cx="80" cy="77" r="2" />
                            <circle cx="100" cy="77" r="2" />
                            <circle cx="120" cy="77" r="2" />
                            <circle cx="135" cy="77" r="2" />
                          </g>
                        )}
                      </g>
                    )}

                    {/* Tier 3 (Top Tier if tiers === 3) */}
                    {cakeTiers === 3 && (
                      <g>
                        {cakeShape === 'heart' ? (
                          <path d="M 75,45 C 65,45 65,75 100,75 C 135,75 135,45 125,45 Z" fill={cakeAccentColor || '#FDFBF7'} stroke="#CBBAAD" strokeWidth="1" />
                        ) : cakeShape === 'square' ? (
                          <rect x="75" y="45" width="50" height="30" fill={cakeAccentColor || '#FDFBF7'} stroke="#CBBAAD" strokeWidth="1" />
                        ) : cakeShape === 'hexagon' ? (
                          <polygon points="75,51 85,45 115,45 125,51 125,75 115,75 85,75 75,75" fill={cakeAccentColor || '#FDFBF7'} stroke="#CBBAAD" strokeWidth="1" />
                        ) : (
                          <rect x="75" y="45" width="50" height="30" rx="5" fill={cakeAccentColor || '#FDFBF7'} stroke="#CBBAAD" strokeWidth="1" />
                        )}

                        {/* Top drips */}
                        {selectedToppings.includes('ganache_drips') && (
                          <path d="M 75,45 c 7,5 10,-2 13,4 c 7,7 10,2 13,6 c 7,-6 10,3 11,3 c 7,-6 10,3 13,-8" fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
                        )}
                      </g>
                    )}

                    {/* Cherries as candles on very top tier */}
                    {selectedToppings.includes('cherries') && (
                      <g>
                        {/* Determine top height coordinates depending on tier status */}
                        {cakeTiers === 3 ? (
                          <>
                            <circle cx="100" cy="38" r="4.5" fill="#D50000" />
                            <path d="M 100,34 Q 103,22 108,24" fill="none" stroke="#2E7D32" strokeWidth="1" />
                          </>
                        ) : cakeTiers === 2 ? (
                          <>
                            <circle cx="100" cy="68" r="4.5" fill="#D50000" />
                            <path d="M 100,64 Q 103,52 108,54" fill="none" stroke="#2E7D32" strokeWidth="1" />
                          </>
                        ) : (
                          <>
                            <circle cx="100" cy="103" r="4.5" fill="#D50000" />
                            <path d="M 100,99 Q 103,87 108,89" fill="none" stroke="#2E7D32" strokeWidth="1" />
                          </>
                        )}
                      </g>
                    )}

                    {/* Strawberries display on sides */}
                    {selectedToppings.includes('strawberries') && (
                      <g fill="#E53935">
                        <polygon points="46,140 50,147 42,146" />
                        <polygon points="154,140 158,147 150,146" />
                        {cakeTiers >= 2 && <polygon points="66,102 70,108 62,107" />}
                      </g>
                    )}

                    {/* Gold foil visual highlights */}
                    {selectedToppings.includes('gold_foil') && (
                      <g fill="#FBC02D" opacity="0.9">
                        <path d="M 45,120 Q 47,118 46,121 Z" />
                        <path d="M 125,130 Q 128,129 126,132 Z" />
                        <path d="M 85,135 Q 88,137 86,139 Z" />
                        {cakeTiers >= 2 && <path d="M 75,90 Q 77,88 76,91 Z" />}
                        {cakeTiers === 3 && <path d="M 95,55 Q 97,54 96,57 Z" />}
                      </g>
                    )}

                    {/* MESSAGE ON CAKE DISPLAY TEXT WRITING */}
                    {cakeMessage && (
                      <text 
                        x="100" 
                        y={cakeTiers === 3 ? "131" : cakeTiers === 2 ? "133" : "130"} 
                        fill="#3E2723" 
                        fontSize="7" 
                        fontWeight="bold" 
                        fontFamily="serif" 
                        fontStyle="italic"
                        textAnchor="middle" 
                        letterSpacing="0.2"
                        className="animate-pulse"
                      >
                        {cakeMessage.length > 20 ? `${cakeMessage.slice(0, 18)}...` : cakeMessage}
                      </text>
                    )}

                  </svg>

                  {/* Absolute visual float badges */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded border border-gray-100 font-bold capitalize">
                    {cakeShape} Base
                  </div>
                  <div className="absolute bottom-2 right-2 bg-[#422210] text-[#faf6f0] text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider font-mono">
                    {cakeFlavor}
                  </div>
                </div>

                {/* Info specifications checklist wrap */}
                <div className="w-full mt-3 grid grid-cols-2 gap-1 text-[11px] text-gray-600 bg-amber-50/20 p-2.5 rounded-lg border border-amber-100/30">
                  <div>Tiers: <span className="font-bold text-[#422210]">{cakeTiers} Layer(s)</span></div>
                  <div>Weight: <span className="font-bold text-[#422210]">{cakeSize} kg</span></div>
                  <div>Frosting: <span className="font-bold text-[#422210]">{cakeFrosting.replace('Silky ', '')}</span></div>
                  <div>Filling: <span className="font-bold text-[#422210] truncate block max-w-[120px]">{cakeFilling}</span></div>
                </div>

              </div>

              {/* REAL-TIME DYNAMIC PAYMENT & QUOTE CALCULATOR RECEIPT */}
              <div className="bg-[#422210] text-[#faf6f0] rounded-2xl shadow-lg p-5 border border-amber-950/40 relative overflow-hidden">
                
                {/* Visual side trim strip */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-amber-500"></div>
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-500/10 rounded-full"></div>

                <div className="flex items-center justify-between border-b border-amber-900 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clipboard className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold tracking-wider uppercase">Receipt Formulation</h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300">Quote Version: v4.26</span>
                </div>

                <div className="space-y-2 text-xs">
                  
                  {/* Base Pricing */}
                  <div className="flex justify-between text-amber-200/90">
                    <span>Base Sponge Sizing ({cakeSize}kg):</span>
                    <span className="font-mono">₹{pricingBreakdown.basePrice}</span>
                  </div>

                  {/* Flavor Premium Surcharges */}
                  {pricingBreakdown.flavorSurcharge > 0 && (
                    <div className="flex justify-between text-amber-200/90">
                      <span>Premium Flavor Surcharge ({cakeFlavor}):</span>
                      <span className="font-mono">+₹{pricingBreakdown.flavorSurcharge}</span>
                    </div>
                  )}

                  {/* Stacked structure premium */}
                  {pricingBreakdown.tiersSurcharge > 0 && (
                    <div className="flex justify-between text-amber-200/90">
                      <span>Multi-Tier Stack Build ({cakeTiers} Tiers):</span>
                      <span className="font-mono">+₹{pricingBreakdown.tiersSurcharge}</span>
                    </div>
                  )}

                  {/* Shapes decor surcharges */}
                  {pricingBreakdown.decorSurcharge > 0 && (
                    <div className="flex justify-between text-amber-200/90">
                      <span>Design Trim, Fillings & Toppings:</span>
                      <span className="font-mono">+₹{pricingBreakdown.decorSurcharge}</span>
                    </div>
                  )}

                  {/* Delivery logic */}
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-amber-200/90">
                      <span>Fresh Secure Delivery Van:</span>
                      <span className="font-mono">+₹{pricingBreakdown.deliveryFee}</span>
                    </div>
                  )}

                  <hr className="border-amber-900 my-2" />

                  {/* Estimation Total */}
                  <div className="flex justify-between items-baseline text-white">
                    <span className="text-sm font-bold">Total Quote Price:</span>
                    <span className="text-xl font-bold font-mono text-amber-400">
                      ₹{pricingBreakdown.totalPrice}
                    </span>
                  </div>

                </div>

                {/* Owner terms card info footer */}
                <div className="text-[10px] text-amber-200/40 mt-3 text-center leading-relaxed">
                  Bake Theory registers payment records in standard INR (₹). Standard pickup options do not attract shipping overheads. All ingredients sourced organic.
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: CUSTOMER MY ORDERS TRACKING SCREEN */}
        {/* ========================================================== */}
        {activeTab === 'my-orders' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* AUTH SHELL FOR UNLOGGED PATRONS */}
            {!loggedInCustomer ? (
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-10 max-w-lg mx-auto text-center space-y-5">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                  <User className="w-6 h-6" />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold font-serif text-gray-800">Identify Customer Account</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Log in with your Phone Pin or Register instantly to save & track your custom cake baking requests!
                  </p>
                </div>

                <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 text-xs text-amber-900/85">
                  🛡️ <strong>Demo Passcode Bypass:</strong> Enter phone: <span className="font-mono font-bold">9876543210</span> and passcode pin: <span className="font-mono font-bold">1234</span> to log in instantly.
                </div>

                {/* Switch Login Register selectors */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setCustAuthMode('login')}
                    className={`flex-1 pb-2 font-bold text-sm transition-all ${
                      custAuthMode === 'login' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-400'
                    }`}
                  >
                    Log In (Existing Client)
                  </button>
                  <button
                    onClick={() => setCustAuthMode('register')}
                    className={`flex-1 pb-2 font-bold text-sm transition-all ${
                      custAuthMode === 'register' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-400'
                    }`}
                  >
                    Register (New Customer)
                  </button>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleCustomerAction} className="space-y-4 text-left">
                  {custAuthMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Hargunjit Singh"
                        className="w-full border border-gray-200 rounded-lg p-2 max-h-10 text-sm focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={custAuthMode === 'register' ? regPhone : userPhone}
                      onChange={(e) => {
                        if (custAuthMode === 'register') setRegPhone(e.target.value);
                        else setUserPhone(e.target.value);
                      }}
                      placeholder="e.g. 9876543210"
                      className="w-full border border-gray-200 rounded-lg p-2 max-h-10 text-sm focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Passcode PIN (4+ digits)</label>
                    <input
                      type="password"
                      required
                      value={custAuthMode === 'register' ? regPass : userPass}
                      onChange={(e) => {
                        if (custAuthMode === 'register') setRegPass(e.target.value);
                        else setUserPass(e.target.value);
                      }}
                      placeholder="••••"
                      className="w-full border border-gray-200 rounded-lg p-2 max-h-10 text-sm focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-sm transition-all"
                  >
                    {custAuthMode === 'register' ? "Complete Registration" : "Enter Dashboard"}
                  </button>
                </form>

              </div>
            ) : (
              // CLIENT LOGGED IN - SHOW THEIR PERSONAL ORDER BOOKINGS Queue
              <div className="space-y-5">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#ebdcd0] pb-4">
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-gray-900">Registered Order Folders</h2>
                    <p className="text-xs text-gray-500">History of your tailored requests from Bake Theory.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('order')}
                    className="mt-2 sm:mt-0 flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Order Cake</span>
                  </button>
                </div>

                {loggedInCustomerOrders.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-amber-100 text-gray-500 space-y-3">
                    <ShoppingBag className="w-10 h-10 text-amber-200 mx-auto" />
                    <p className="text-sm font-semibold">You haven't placed any custom cake orders yet!</p>
                    <p className="text-xs">All custom requests linked with phone <strong>{loggedInCustomer.phone}</strong> will register here.</p>
                    <button
                      onClick={() => setActiveTab('order')}
                      className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold"
                    >
                      Bake Premium Cake Now
                    </button>
                  </div>
                ) : (
                  loggedInCustomerOrders.map(ord => (
                    <div key={ord.id} className="bg-white rounded-2xl border border-amber-100 shadow-xs overflow-hidden">
                      
                      {/* Top banner tag status */}
                      <div className="bg-amber-50/55 p-3 sm:px-4 border-b border-amber-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-800 font-bold text-sm">{ord.id}</span>
                          <span className="text-[10px] text-gray-500">Baking Ordered: {new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Tracker status pill badges */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Baking State:</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.orderStatus === 'pending' ? 'bg-amber-100 text-amber-900' :
                            ord.orderStatus === 'approved' ? 'bg-blue-100 text-blue-900' :
                            ord.orderStatus === 'baking' ? 'bg-purple-100 text-purple-900 animate-pulse' :
                            ord.orderStatus === 'finishing' ? 'bg-pink-100 text-pink-900' :
                            ord.orderStatus === 'ready' ? 'bg-green-100 text-green-950' :
                            ord.orderStatus === 'completed' ? 'bg-gray-100 text-gray-600' :
                            'bg-red-100 text-red-900'
                          }`}>
                            {ord.orderStatus === 'ready' ? 'Ready for Hand-off 🎁' : ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                        
                        {/* Order Specs text (Col-span 8) */}
                        <div className="md:col-span-8 space-y-3.5">
                          <div className="grid grid-cols-2 gap-3.5 text-xs">
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Ingredients Sizing</p>
                              <p className="font-bold text-gray-800">{ord.sizeKg} kg ({ord.tiers} Tier{ord.tiers > 1 ? 's' : ''})</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Baking Flavor</p>
                              <p className="font-bold text-gray-800">{ord.flavor}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Piping Cream Shape</p>
                              <p className="font-bold text-gray-800 capitalize">{ord.shape}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Target Hand-off</p>
                              <p className="font-bold text-amber-900">{ord.deliveryDate} @ {ord.deliveryTime}</p>
                            </div>
                          </div>

                          {ord.customMessage && (
                            <div className="bg-amber-50/40 p-2 text-xs rounded border border-amber-100 italic">
                              ✍️ Message On Cake: <strong className="text-gray-800">"{ord.customMessage}"</strong>
                            </div>
                          )}

                          {ord.specialNotes && (
                            <div className="text-[11px] text-gray-500">
                              Production Specs: <span className="text-gray-700 font-medium">{ord.specialNotes}</span>
                            </div>
                          )}

                          {/* Horizontal delivery visual tracking timeline */}
                          <div className="pt-3">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Live Baking Progress Indicator:</h4>
                            <div className="relative flex items-center justify-between">
                              <div className="absolute left-1 right-1 top-2.5 h-0.5 bg-gray-200 -z-1"></div>
                              
                              {/* Pending dot */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-1 ${
                                  ord.orderStatus !== 'cancelled' ? 'bg-amber-600 text-white' : 'bg-gray-300'
                                }`}>
                                  1
                                </div>
                                <span className="text-[8px] mt-1 font-semibold text-gray-600">Pending</span>
                              </div>

                              {/* Approved / In bakehouse dot */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-1 ${
                                  ['approved', 'baking', 'finishing', 'ready', 'completed'].includes(ord.orderStatus) ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                  2
                                </div>
                                <span className="text-[8px] mt-1 font-semibold text-gray-600">In Baking</span>
                              </div>

                              {/* Ready dot */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-1 ${
                                  ['ready', 'completed'].includes(ord.orderStatus) ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                  3
                                </div>
                                <span className="text-[8px] mt-1 font-semibold text-gray-600">Ready</span>
                              </div>

                              {/* Completed dot */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-1 ${
                                  ord.orderStatus === 'completed' ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                  4
                                </div>
                                <span className="text-[8px] mt-1 font-semibold text-gray-600">Completed</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Order Financial Balance (Col-span 4) */}
                        <div className="md:col-span-4 bg-[#fbf9f6] p-4 rounded-xl border border-amber-100/50 flex flex-col justify-between text-xs space-y-3.5">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase block tracking-wider font-bold mb-1">Financial Receipt Summary</span>
                            <div className="flex justify-between text-gray-600">
                              <span>Total Quote:</span>
                              <span className="font-mono font-bold">₹{ord.totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-green-700 font-medium">
                              <span>Deposit Paid:</span>
                              <span className="font-mono">₹{ord.amountPaid}</span>
                            </div>
                            <hr className="my-1.5 border-amber-100" />
                            <div className="flex justify-between font-bold text-[#563c2c] text-sm">
                              <span>Outstanding Due:</span>
                              <span className="font-mono text-red-700">₹{ord.totalPrice - ord.amountPaid}</span>
                            </div>
                          </div>

                          {/* Friendly action guidance */}
                          <div className="space-y-2">
                            <span className="text-[9px] text-[#846b5d] italic leading-tight block">
                              {ord.paymentStatus === 'paid_in_full' ? '🎉 Fully Paid! Thank you for supporting small home bakeries.' : '💳 Tap below to coordinate balance clearance or upload receipt.'}
                            </span>
                            
                            <a
                              href={`https://wa.me/91${OWNER_MOBILE}?text=${encodeURIComponent(`Hi, referring to Custom Cake Order ID ${ord.id}. Let me know payment details!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-center block text-[11px] font-bold text-gray-700 border border-gray-200"
                            >
                              Coordinate with Bakery
                            </a>
                            {ord.referencePhotoBase64 && (
                              <div className="border-t border-amber-100 pt-2 w-full flex items-center justify-between gap-1">
                                <span className="text-[9px] uppercase font-bold text-gray-400">Attached Reference:</span>
                                <img 
                                  src={ord.referencePhotoBase64} 
                                  alt="Attached Reference" 
                                  className="h-9 w-auto object-contain rounded border border-amber-200 bg-white p-0.5" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                          </div>

                        </div>

                      </div>

                    </div>
                  ))
                )}

              </div>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: SECURE OWNER GATEWAY PANEL PORTAL */}
        {/* ========================================================== */}
        {activeTab === 'owner' && (
          <div className="space-y-6">
            
            {/* Owner Authentication block */}
            {!isOwnerAuthenticated ? (
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-10 max-w-lg mx-auto text-center space-y-5">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white mx-auto">
                  <Lock className="w-6 h-6" />
                </div>

                <div>
                  <h2 className="text-xl font-bold font-serif text-[#422210]">Bakehouse Ledger Portal</h2>
                  <p className="text-xs text-amber-800">
                    Secure login access for Bake Theory managers to regulate custom orders and track payments.
                  </p>
                </div>

                <div className="bg-amber-100/50 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-950">
                  🔒 <strong>Administrative Authorization:</strong> Please enter your password or authorized access PIN code below to view ledger updates and billing queues.
                </div>

                <form onSubmit={handleOwnerLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Owner Admin Gate Passcode PIN</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter secret passcode"
                      value={ownerPass}
                      onChange={(e) => setOwnerPass(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2 max-h-11 outline-none text-center text-md tracking-wider font-mono focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {ownerError && (
                    <div className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{ownerError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#422210] hover:bg-[#52321c] text-[#faf6f0] rounded-lg font-bold text-xs tracking-wider uppercase"
                  >
                    Open Business Ledger
                  </button>
                </form>

              </div>
            ) : (
              // FULL BUSINESS OPERATIONS SUITE
              <div className="space-y-6 animate-fade-in">
                
                {/* Header operations header */}
                <div className="bg-white rounded-xl border border-amber-100 shadow-2xs p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-serif text-gray-900">Bakehouse Ledger Command Suite</h2>
                    <p className="text-xs text-gray-500">Regulate billing, payment receipts, order archives, and delivery schedules.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={resetToSeedData}
                      className="px-3 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-950 rounded-lg text-xs font-semibold flex items-center gap-1"
                      title="Overwrites with mock demo data to try out the dashboard functions"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Load Demo Data</span>
                    </button>
                    <button
                      onClick={() => setIsOwnerAuthenticated(false)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                    >
                      Lock Ledger
                    </button>
                  </div>
                </div>

                {/* METRICS ROW CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-white p-4 rounded-xl border border-amber-100/65 shadow-2xs">
                    <div className="flex justify-between items-start text-gray-500">
                      <span className="text-[10px] font-bold uppercase tracking-wider block">Total Baking Orders</span>
                      <TrendingUp className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-gray-900 mt-1">{ownerStats.totalCakes}</div>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Excludes cancelled requests</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-100/65 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Gross Forecast Volume</span>
                    <div className="text-2xl font-bold font-mono text-amber-700 mt-1">₹{ownerStats.expectedRevenue}</div>
                    <span className="text-[9px] text-[#422210] block mt-0.5">Sum of cake quotes list</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-100/65 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Deposits + Cleared Cash</span>
                    <div className="text-2xl font-bold font-mono text-green-700 mt-1">₹{ownerStats.totalCollected}</div>
                    <p className="text-[9px] text-green-700 mt-0.5 font-bold">🎯 Clear collected efficiency</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-100/65 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Outstanding Due Recievables</span>
                    <div className="text-2xl font-bold font-mono text-red-600 mt-1">₹{ownerStats.outstandingReceivables}</div>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Payments due to clear at delivery</span>
                  </div>

                </div>

                {/* GRID QUEUE FILTER & SPLIT VIEW DETAILS */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT COLUMN: FILTER SEARCH AND LIST (Col-span 7) */}
                  <div className="xl:col-span-7 space-y-4 bg-white rounded-xl border border-amber-100 p-4 shadow-3xs">
                    
                    {/* Search & filters panel selectors */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search Client name, ID or specs..."
                          value={ownerSearch}
                          onChange={(e) => setOwnerSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 bg-[#fbfbf9]"
                        />
                      </div>

                      <div className="flex gap-2">
                        {/* Status dropdown filter */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                          <Filter className="w-3.5 h-3.5" />
                          <select
                            value={ownerStatusFilter}
                            onChange={(e) => setOwnerStatusFilter(e.target.value)}
                            className="bg-transparent border-none py-0 focus:ring-0 text-xs font-medium cursor-pointer"
                          >
                            <option value="all">All Stages</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="baking">Baking</option>
                            <option value="finishing">Finishing Touches</option>
                            <option value="ready">Ready for Hand-off</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Payment Status dropdown filter */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                          <CreditCard className="w-3.5 h-3.5" />
                          <select
                            value={ownerPaymentFilter}
                            onChange={(e) => setOwnerPaymentFilter(e.target.value)}
                            className="bg-transparent border-none py-0 focus:ring-0 text-xs font-medium cursor-pointer"
                          >
                            <option value="all">All Billings</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="deposit_paid">Deposit Paid</option>
                            <option value="paid_in_full">Full Clear</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Table View List of Orders */}
                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider">
                            <th className="p-2.5">Order ID / Patron</th>
                            <th className="p-2.5">Cake Details</th>
                            <th className="p-2.5">Delivery Time</th>
                            <th className="p-2.5">Finance Status</th>
                            <th className="p-2.5 text-right">Quote</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredOrdersForOwner.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-gray-400">
                                No order records match parameters. Create mock order templates or readjust search parameters.
                              </td>
                            </tr>
                          ) : (
                            filteredOrdersForOwner.map(ord => {
                              const isSelected = selectedOrderDetails?.id === ord.id;
                              return (
                                <tr
                                  key={ord.id}
                                  onClick={() => handleSelectOrderAndPopulate(ord)}
                                  className={`hover:bg-amber-50/30 cursor-pointer transition-all ${
                                    isSelected ? 'bg-amber-50/70 border-l-4 border-amber-600' : ''
                                  }`}
                                >
                                  <td className="p-2.5 font-medium">
                                    <div className="flex items-center gap-1 text-gray-900">
                                      {ord.shape === 'heart' && <Heart className="w-3 h-3 text-red-500 fill-red-500 shrink-0" />}
                                      <span className="font-mono font-bold text-xs">{ord.id}</span>
                                    </div>
                                    <div className="text-gray-500 font-semibold mt-0.5 line-clamp-1">{ord.customerName}</div>
                                  </td>
                                  <td className="p-2.5">
                                    <span className="font-medium text-gray-800 line-clamp-1">
                                      {ord.sizeKg}kg {ord.flavor}
                                    </span>
                                    <span className="text-[10px] text-gray-500 block">Tiers: {ord.tiers} • {ord.frosting}</span>
                                  </td>
                                  <td className="p-2.5">
                                    <div className="flex items-center gap-1 font-semibold text-amber-950">
                                      <Calendar className="w-3 h-3 shrink-0 text-amber-600" />
                                      {ord.deliveryDate}
                                    </div>
                                    <div className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5" />
                                      {ord.deliveryTime}
                                      <span className={`px-1 py-0.2 rounded-full text-[8px] border ml-1 uppercase ${
                                        ord.pickupOrDelivery === 'delivery' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-green-50 text-green-800 border-green-200'
                                      }`}>
                                        {ord.pickupOrDelivery}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-2.5 space-y-1">
                                    {/* Order stage status tag */}
                                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase block tracking-wider text-center max-w-[85px] ${
                                      ord.orderStatus === 'pending' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                      ord.orderStatus === 'approved' ? 'bg-blue-100 text-blue-900' :
                                      ord.orderStatus === 'baking' ? 'bg-purple-100 text-purple-900 animate-pulse' :
                                      ord.orderStatus === 'ready' ? 'bg-green-100 text-green-950' :
                                      'bg-gray-100 text-gray-600'
                                    }`}>
                                      {ord.orderStatus}
                                    </span>

                                    {/* Billing state tag */}
                                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold block text-center max-w-[85px] ${
                                      ord.paymentStatus === 'paid_in_full' ? 'bg-green-100 text-green-800' :
                                      ord.paymentStatus === 'deposit_paid' ? 'bg-amber-100 text-amber-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {ord.paymentStatus.replace('_', ' ')}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-right font-bold text-gray-900 font-mono">
                                    ₹{ord.totalPrice}
                                    <span className="text-[9px] text-gray-400 block font-normal">Paid: ₹{ord.amountPaid}</span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: DETAIL DECK & REGISTRY SETTINGS (Col-span 5) */}
                  <div className="xl:col-span-5 bg-white rounded-xl border border-amber-100 p-4 sm:p-5 shadow-sm space-y-4">
                    
                    {!selectedOrderDetails ? (
                      <div className="py-20 text-center text-gray-400 space-y-2">
                        <Clipboard className="w-10 h-10 text-gray-200 mx-auto" />
                        <p className="text-sm font-semibold">No Order Selected</p>
                        <p className="text-xs">Click any order in the ledger on the left to review details, update status, and record transaction payments.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        
                        {/* Title client top ribbon */}
                        <div className="border-b border-gray-100 pb-3 flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                              {selectedOrderDetails.id}
                            </span>
                            <h3 className="text-base font-bold text-gray-900 mt-1">{selectedOrderDetails.customerName}</h3>
                            <p className="text-xs text-gray-500">Call / WA: <strong>+91 {selectedOrderDetails.customerPhone}</strong></p>
                          </div>
                          
                          <div className="flex gap-2 shrink-0">
                            {/* Quick print slip trigger */}
                            <button
                              onClick={() => {
                                setIsPrintingReceipt(true);
                                setTimeout(() => {
                                  window.print();
                                  setIsPrintingReceipt(false);
                                }, 300);
                              }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded"
                              title="Print Receipt Slip"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            
                            {/* WhatsApp link trigger */}
                            <a
                              href={getWhatsAppLink(selectedOrderDetails)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-100 hover:bg-green-200 text-green-800 p-1.5 rounded transition-all"
                              title="WhatsApp client updates"
                            >
                              <MessageSquare className="w-4 h-4 fill-green-800" />
                            </a>
                          </div>
                        </div>

                        {/* Order Specifications Summarizer */}
                        <div className="space-y-2.5 text-xs bg-[#fefefe] p-3 rounded border border-gray-100">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bake Specifications Structure</h4>
                          <div className="grid grid-cols-2 gap-2 text-gray-600">
                            <div>Weight Size: <span className="font-bold text-gray-900">{selectedOrderDetails.sizeKg} kg ({selectedOrderDetails.tiers} Stack)</span></div>
                            <div>Shape base: <span className="font-bold text-gray-900 capitalize">{selectedOrderDetails.shape}</span></div>
                            <div>Sponge flavor: <span className="font-bold text-[#422210]">{selectedOrderDetails.flavor}</span></div>
                            <div>Icing Frosting: <span className="font-bold text-[#422210]">{selectedOrderDetails.frosting}</span></div>
                            <div>Inner Fillings: <span className="font-bold text-[#422210] truncate block max-w-[150px]">{selectedOrderDetails.filling}</span></div>
                            <div>Accent Shades: <span className="font-bold text-gray-900">{selectedOrderDetails.accentColor}</span></div>
                          </div>
                          {selectedOrderDetails.customMessage && (
                            <p className="text-xs border border-dashed border-amber-300 bg-amber-50/20 p-2 text-amber-950 font-medium rounded italic text-center">
                              ✍️ Msg On Top: "{selectedOrderDetails.customMessage}"
                            </p>
                          )}
                          {selectedOrderDetails.referencePhotoBase64 && (
                            <div className="border-t border-gray-100 pt-2.5 mt-2 space-y-1">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">Customer Reference Photo</span>
                              <img 
                                src={selectedOrderDetails.referencePhotoBase64} 
                                alt="Reference Link" 
                                className="max-h-48 w-full object-contain bg-gray-50 border border-amber-100 rounded-lg p-1.5" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>

                        {/* EDIT QUEUE FORM CONTROLS */}
                        <div className="space-y-3 pt-2 text-xs">
                          <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Update Order States & Operations</h4>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Bakehouse Phase</label>
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as any)}
                                className="w-full bg-white border border-gray-200 rounded p-1.5 focus:ring-1 focus:ring-amber-500"
                              >
                                <option value="pending">Pending Approval</option>
                                <option value="approved">Approved</option>
                                <option value="baking">Baking sponge</option>
                                <option value="finishing">Finishing Touches</option>
                                <option value="ready">Ready for Pickup / Out</option>
                                <option value="completed">Completed & Deliv.</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Billing State</label>
                              <select
                                value={editPayStatus}
                                onChange={(e) => setEditPayStatus(e.target.value as any)}
                                className="w-full bg-white border border-gray-200 rounded p-1.5 focus:ring-1 focus:ring-amber-500"
                              >
                                <option value="unpaid">Unpaid</option>
                                <option value="deposit_paid">Deposit Paid Only</option>
                                <option value="paid_in_full">Completed Free Clearance</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Logged Received Amount (₹)</label>
                              <input
                                type="number"
                                value={editPaidAmt}
                                onChange={(e) => setEditPaidAmt(Number(e.target.value))}
                                className="w-full bg-white border border-gray-200 rounded p-1.5 font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Manual discount (₹)</label>
                              <input
                                type="number"
                                value={editDiscountVal}
                                onChange={(e) => setEditDiscountVal(Number(e.target.value))}
                                className="w-full bg-white border border-gray-200 rounded p-1.5 font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Custom Surcharge Adjustments (₹)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editSurcharge}
                                onChange={(e) => setEditSurcharge(Number(e.target.value))}
                                className="w-full bg-white border border-gray-200 rounded p-1.5 font-mono"
                                placeholder="Intricate design premium details surcharge"
                              />
                              <span className="text-gray-400 text-[10px] shrink-0">Used for custom piping upgrades</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Ledger Transaction Ref / Notes</label>
                            <input
                              type="text"
                              value={editPayNotes}
                              onChange={(e) => setEditPayNotes(e.target.value)}
                              placeholder="e.g. Paid Gpay ref #8394"
                              className="w-full bg-white border border-gray-200 rounded p-1.5"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Owner Private Production Specs</label>
                            <textarea
                              rows={2}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Notes visible on baking queues... e.g. Less sweetness requested."
                              className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs"
                            />
                          </div>

                          {/* Trigger Update Action */}
                          <div className="pt-2">
                            <button
                              onClick={handleSaveOwnerSettings}
                              className="w-full py-2 bg-[#422210] hover:bg-[#5a3623] text-white font-bold rounded-lg text-xs uppercase duration-200"
                            >
                              Save Surcharges & State Update
                            </button>
                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================== */}
      {/* MINIMAL PRINT STYLES RECEPT OVERLAY SLIP (Invisible by default) */}
      {/* ========================================================== */}
      {isPrintingReceipt && selectedOrderDetails && (
        <div className="fixed inset-0 bg-white text-black font-mono p-8 text-xs z-50 overflow-y-auto print-visible flex flex-col space-y-4">
          <div className="text-center border-b border-dashed pb-4">
            <h1 className="text-xl font-bold font-serif">BAKE THEORY BAKERY</h1>
            <p className="text-[10px]">Handcrafted Premium Custom Cakes • Owner Mobile: {OWNER_MOBILE}</p>
            <p className="text-[10px] mt-1">Order Date: {new Date(selectedOrderDetails.createdAt || "").toLocaleString()}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <span>BILL TO:</span>
              <span>INVOICE #{selectedOrderDetails.id}</span>
            </div>
            <p>Name: {selectedOrderDetails.customerName}</p>
            <p>Phone: +91 {selectedOrderDetails.customerPhone}</p>
            <p>Method: {selectedOrderDetails.pickupOrDelivery.toUpperCase()} {selectedOrderDetails.deliveryAddress && ` - ${selectedOrderDetails.deliveryAddress}`}</p>
            <p>Delivery Schedule: {selectedOrderDetails.deliveryDate} @ {selectedOrderDetails.deliveryTime}</p>
          </div>

          <hr className="border-dashed" />

          <div className="space-y-1">
            <p className="font-bold">CAKE PARAMETERS:</p>
            <p>- Sponge Size Base: {selectedOrderDetails.sizeKg} kg ({selectedOrderDetails.tiers} Stack Tiers)</p>
            <p>- Flavor selection: {selectedOrderDetails.flavor}</p>
            <p>- Shape Form Profile: {selectedOrderDetails.shape.toUpperCase()}</p>
            <p>- Frosting & Core Cream: {selectedOrderDetails.frosting} / {selectedOrderDetails.filling}</p>
            {selectedOrderDetails.customMessage && <p>- Script Calligraphy: "{selectedOrderDetails.customMessage}"</p>}
            {selectedOrderDetails.specialNotes && <p>- Private Production specs: "{selectedOrderDetails.specialNotes}"</p>}
          </div>

          <hr className="border-dashed" />

          <div className="space-y-1.5 text-right font-bold w-full">
            <div className="flex justify-between">
              <span>Base Cost:</span>
              <span>₹{selectedOrderDetails.basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Flavor Surcharge:</span>
              <span>₹{selectedOrderDetails.flavorSurcharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Structural Multi-tiers:</span>
              <span>₹{selectedOrderDetails.tiersSurcharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Design Surcharge & Toppings:</span>
              <span>₹{selectedOrderDetails.decorSurcharge}</span>
            </div>
            {selectedOrderDetails.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>₹{selectedOrderDetails.deliveryFee}</span>
              </div>
            )}
            {selectedOrderDetails.discount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Adjustment Discount:</span>
                <span>-₹{selectedOrderDetails.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-dashed pt-2 font-black text-gray-900">
              <span>GRAND TOTAL PRICE:</span>
              <span>₹{selectedOrderDetails.totalPrice}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>AMOUNT RECOVERY PAID:</span>
              <span>₹{selectedOrderDetails.amountPaid}</span>
            </div>
            <div className="flex justify-between text-red-700 text-sm">
              <span>OUTSTANDING AMOUNT DUE:</span>
              <span>₹{selectedOrderDetails.totalPrice - selectedOrderDetails.amountPaid}</span>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-dashed text-[10px]">
            <p>Thank you for supporting small businesses and home kitchens! 🎂</p>
            <p>Bake Theory - Baked with Love & Science.</p>
          </div>
        </div>
      )}

      {/* FOOTER BRACE */}
      <footer className="bg-white border-t border-[#ebdcd0] py-6 text-center text-xs text-gray-500 mt-10">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© 2026 <strong>Bake Theory</strong>. Fine Custom Homemade Cakes. All rights reserved.</p>
          <p className="text-[11px] text-[#422210]/60">Handcrafted lovingly with organic toppings, pure dairy cream, and chemical-free sponge bases.</p>
        </div>
      </footer>

    </div>
  );
}
