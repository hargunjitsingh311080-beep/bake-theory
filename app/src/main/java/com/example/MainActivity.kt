package com.example

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.ui.theme.MyApplicationTheme
import org.json.JSONObject
import org.json.JSONArray
import java.net.URLEncoder
import java.text.SimpleDateFormat
import java.util.*
import coil.compose.AsyncImage
import androidx.compose.ui.layout.ContentScale
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.launch
import kotlinx.coroutines.GlobalScope

// ==========================================
// DATA MODELS
// ==========================================

data class CakeOrder(
    val id: String,
    val customerName: String,
    val customerPhone: String,
    val customerEmail: String,
    val pickupOrDelivery: String, 
    val deliveryAddress: String = "",
    val deliveryDate: String,
    val deliveryTime: String,
    val sizeKg: Double,
    val tiers: Int,
    val shape: String, 
    val flavor: String,
    val frosting: String,
    val filling: String,
    val accentColor: String,
    val customMessage: String = "",
    val toppings: List<String> = emptyList(),
    val specialNotes: String = "",
    val basePrice: Int,
    val flavorSurcharge: Int,
    val tiersSurcharge: Int,
    val decorSurcharge: Int,
    val deliveryFee: Int,
    var discount: Int = 0,
    var totalPrice: Int,
    var paymentStatus: String, 
    var paymentMethod: String, 
    val depositAmount: Int,
    var amountPaid: Int,
    var paymentNotes: String = "",
    var orderStatus: String, 
    val createdAt: String
)

const val BACKEND_URL = "https://ais-dev-ymptfysun5z77fkdksza2r-927215896925.asia-southeast1.run.app"

data class SignatureCake(
    val id: String,
    val name: String,
    val description: String,
    val baseSize: Double,
    val baseTiers: Int,
    val baseShape: String,
    val baseFlavor: String,
    val baseFrosting: String,
    val baseFilling: String,
    val baseToppings: List<String>,
    val baseColor: String,
    val tags: List<String>,
    val price: Int,
    val image: String
)

enum class Tab { SHOWROOM, DESIGNER, STATUS, ADMIN }
enum class Step { SIZING, FLAVOR, AESTHETICS, CUSTOMER, SUCCESS }

// ==========================================
// CONSTANTS & SEED DATA
// ==========================================

val DEFAULT_SIGNATURE_CAKES = listOf(
    SignatureCake("SC-101", "Classic Rose Bouquet", "An elegant, romantic highlight perfect for birthdays and anniversaries. Adorned with delicate buttercream rose transfers, beautiful sugar pearls, and a warm honey gold base tint.", 1.5, 1, "round", "Red Velvet Velvet Cream", "Silky Buttercream", "Fresh Strawberry Compote", listOf("pearls", "gold_foil"), "#EEDAA2", listOf("Anniversary", "Birthday", "Elegant"), 1890, "https://images.unsplash.com/photo-1535141192574-5d4897c13636?q=80&w=600&auto=format&fit=crop"),
    SignatureCake("SC-102", "Double Chocolate Dream", "Deep decadent Belgian chocolate layers filled with pure Nutella frosting cream and decorated with glazed maraschino cherries and flowing hot chocolate drips.", 1.0, 1, "round", "Belgian Chocolate Fudge", "Rich Chocolate Ganache", "Pure Premium Nutella Spread", listOf("cherries", "ganache_drips"), "#4E3629", listOf("Chocolate", "Birthday", "Celebration"), 1440, "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop"),
    SignatureCake("SC-103", "Pastel Princess Magic", "Multi-layered towering pastel colored marvel featuring majestic vanilla flavor, silky smooth buttercream casing, edible 24k gold leaf details, French macarons, and rainbow sprinkles.", 2.0, 2, "round", "Classic Vanilla Bean", "Silky Buttercream", "Standard Custard / Cream", listOf("sprinkles", "macarons", "gold_foil"), "#FFD3DF", listOf("Kids", "Birthday", "Vibrant"), 2650, "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=600&auto=format&fit=crop"),
    SignatureCake("SC-104", "Espresso Mocha Crunch", "A coffee lover's absolute crown jewel! Baked with rich, deep-brewed espresso crumbles, layered with coffee mocha cream, caramel drips, and finished with caramelized walnuts and gold flakes.", 1.5, 1, "square", "Espresso Mocha Crunch", "Silky Buttercream", "Crushed Oreo Cookie Creme", listOf("gold_foil", "ganache_drips"), "#E2D4F0", listOf("Coffee", "Birthday", "Modern"), 2190, "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=600&auto=format&fit=crop"),
    SignatureCake("SC-105", "Heart-to-Heart Velvet Rouge", "Celebrate deep romantic anniversaries with this exquisite heart-shaped masterpiece. Rich velvety crumb layers sandwiched between fresh strawberry spreads and silky buttercream piping.", 1.0, 1, "heart", "Red Velvet Velvet Cream", "Silky Buttercream", "Fresh Strawberry Compote", listOf("pearls", "cherries"), "#FFD3DF", listOf("Romance", "Anniversary", "Heart"), 1540, "https://images.unsplash.com/photo-1616690710400-a16d146927c5?q=80&w=600&auto=format&fit=crop"),
    SignatureCake("SC-106", "Fresh Strawberry Meadow", "Light, summery bliss incorporating pure vanilla sponge, whipped Chantilly cream frosting layers, filled with seasonal strawberry reduction, and top-piled with fresh glazed strawberries.", 1.0, 1, "round", "Classic Vanilla Bean", "Whipped Chantilly", "Fresh Strawberry Compote", listOf("strawberries", "pearls"), "#FDFBF7", listOf("Fruit", "Fresh", "Celebration"), 1290, "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop")
)

val DEFAULT_ORDERS = emptyList<CakeOrder>()

fun cakeOrderToJson(ord: CakeOrder): JSONObject {
    val obj = JSONObject()
    obj.put("id", ord.id)
    obj.put("customerName", ord.customerName)
    obj.put("customerPhone", ord.customerPhone)
    obj.put("customerEmail", ord.customerEmail)
    obj.put("pickupOrDelivery", ord.pickupOrDelivery)
    obj.put("deliveryAddress", ord.deliveryAddress)
    obj.put("deliveryDate", ord.deliveryDate)
    obj.put("deliveryTime", ord.deliveryTime)
    obj.put("sizeKg", ord.sizeKg)
    obj.put("tiers", ord.tiers)
    obj.put("shape", ord.shape)
    obj.put("flavor", ord.flavor)
    obj.put("frosting", ord.frosting)
    obj.put("filling", ord.filling)
    obj.put("accentColor", ord.accentColor)
    obj.put("customMessage", ord.customMessage)
    
    val toppingsArray = JSONArray()
    ord.toppings.forEach { toppingsArray.put(it) }
    obj.put("toppings", toppingsArray)
    
    obj.put("specialNotes", ord.specialNotes)
    obj.put("basePrice", ord.basePrice)
    obj.put("flavorSurcharge", ord.flavorSurcharge)
    obj.put("tiersSurcharge", ord.tiersSurcharge)
    obj.put("decorSurcharge", ord.decorSurcharge)
    obj.put("deliveryFee", ord.deliveryFee)
    obj.put("discount", ord.discount)
    obj.put("totalPrice", ord.totalPrice)
    obj.put("paymentStatus", ord.paymentStatus)
    obj.put("paymentMethod", ord.paymentMethod)
    obj.put("depositAmount", ord.depositAmount)
    obj.put("amountPaid", ord.amountPaid)
    obj.put("paymentNotes", ord.paymentNotes)
    obj.put("orderStatus", ord.orderStatus)
    obj.put("createdAt", ord.createdAt)
    return obj
}

fun jsonToCakeOrder(obj: JSONObject): CakeOrder {
    val toppingsList = mutableListOf<String>()
    val arr = obj.optJSONArray("toppings")
    if (arr != null) {
        for (i in 0 until arr.length()) {
            toppingsList.add(arr.getString(i))
        }
    }
    return CakeOrder(
        id = obj.getString("id"),
        customerName = obj.getString("customerName"),
        customerPhone = obj.getString("customerPhone"),
        customerEmail = obj.optString("customerEmail", ""),
        pickupOrDelivery = obj.getString("pickupOrDelivery"),
        deliveryAddress = obj.optString("deliveryAddress", ""),
        deliveryDate = obj.getString("deliveryDate"),
        deliveryTime = obj.getString("deliveryTime"),
        sizeKg = obj.getDouble("sizeKg"),
        tiers = obj.getInt("tiers"),
        shape = obj.getString("shape"),
        flavor = obj.getString("flavor"),
        frosting = obj.getString("frosting"),
        filling = obj.optString("filling", "Standard Custard / Cream"),
        accentColor = obj.getString("accentColor"),
        customMessage = obj.optString("customMessage", ""),
        toppings = toppingsList,
        specialNotes = obj.optString("specialNotes", ""),
        basePrice = obj.getInt("basePrice"),
        flavorSurcharge = obj.optInt("flavorSurcharge", 0),
        tiersSurcharge = obj.optInt("tiersSurcharge", 0),
        decorSurcharge = obj.optInt("decorSurcharge", 0),
        deliveryFee = obj.optInt("deliveryFee", 0),
        discount = obj.optInt("discount", 0),
        totalPrice = obj.getInt("totalPrice"),
        paymentStatus = obj.getString("paymentStatus"),
        paymentMethod = obj.optString("paymentMethod", "upi"),
        depositAmount = obj.optInt("depositAmount", 0),
        amountPaid = obj.optInt("amountPaid", 0),
        paymentNotes = obj.optString("paymentNotes", ""),
        orderStatus = obj.getString("orderStatus"),
        createdAt = obj.getString("createdAt")
    )
}

fun saveOrdersToBackend(context: Context, orders: List<CakeOrder>) {
    val client = OkHttpClient()
    val sharedPrefs = context.getSharedPreferences("BakeTheoryPrefs", Context.MODE_PRIVATE)
    val serverUrl = sharedPrefs.getString("backend_api_url", BACKEND_URL) ?: BACKEND_URL
    
    val arr = JSONArray()
    orders.forEach { arr.put(cakeOrderToJson(it)) }
    
    val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
    val requestBody = arr.toString().toRequestBody(mediaType)
    
    GlobalScope.launch(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url("$serverUrl/api/orders/save-all")
                .post(requestBody)
                .build()
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    println("BakeTheory-API: Save remote database failed with code ${response.code}")
                } else {
                    println("BakeTheory-API: Synchronized successfully with server database!")
                }
            }
        } catch (e: Exception) {
            println("BakeTheory-API: Network synchronization failed, queued locally.")
            e.printStackTrace()
        }
    }
}

fun saveOrdersToSharedPrefs(context: Context, orders: List<CakeOrder>) {
    val sharedPrefs = context.getSharedPreferences("BakeTheoryPrefs", Context.MODE_PRIVATE)
    val arr = JSONArray()
    orders.forEach { arr.put(cakeOrderToJson(it)) }
    sharedPrefs.edit().putString("saved_orders", arr.toString()).apply()
    
    // Asynchronously update full-stack db
    saveOrdersToBackend(context, orders)
}

fun loadOrdersFromSharedPrefs(context: Context): List<CakeOrder> {
    val sharedPrefs = context.getSharedPreferences("BakeTheoryPrefs", Context.MODE_PRIVATE)
    val response = sharedPrefs.getString("saved_orders", null) ?: return DEFAULT_ORDERS
    try {
        val arr = JSONArray(response)
        val res = mutableListOf<CakeOrder>()
        for (i in 0 until arr.length()) {
            res.add(jsonToCakeOrder(arr.getJSONObject(i)))
        }
        return res
    } catch (e: Exception) {
        return DEFAULT_ORDERS
    }
}

val SIZES = listOf(
    Pair(0.5, "0.5 kg (Serves 4 - 6)"),
    Pair(1.0, "1.0 kg (Serves 8 - 12)"),
    Pair(1.5, "1.5 kg (Serves 12 - 18)"),
    Pair(2.0, "2.0 kg (Serves 16 - 24)"),
    Pair(3.0, "3.0 kg (Serves 25 - 36)")
)

val SHAPES = listOf(
    Triple("round", "Charming Round", 0),
    Triple("square", "Modern Square", 0),
    Triple("heart", "Romantic Heart", 100),
    Triple("hexagon", "Hexagonal Geometric", 150)
)

val FLAVORS = listOf(
    Triple("Classic Vanilla Bean", 0, "Rich Madagascar vanilla"),
    Triple("Belgian Chocolate Fudge", 150, "Decadent Belgian dark cocoa"),
    Triple("Red Velvet Velvet Cream", 200, "Classic cocoa with cream cheese"),
    Triple("Zesty Lemon Blueberry", 180, "Tangy lemon with blueberries"),
    Triple("Espresso Mocha Crunch", 160, "Mocha cream with espresso bits"),
    Triple("Salted Caramel Praline", 150, "Amber caramel with pecan brittle")
)

val FROSTINGS = listOf(
    Triple("Silky Buttercream", 0, "Smooth, fluffy standard finish"),
    Triple("Premium Satin Fondant", 250, "Clean, elegant custom sculpture cover"),
    Triple("Whipped Chantilly", 0, "Light and delicate dairy fresh cream"),
    Triple("Rich Chocolate Ganache", 180, "Silky glaze of dark cocoa")
)

val FILLINGS = listOf(
    Pair("Standard Custard / Cream", 0),
    Pair("Chocolate Chips & Hot Fudge", 60),
    Pair("Fresh Strawberry Compote", 120),
    Pair("Crushed Oreo Cookie Creme", 70),
    Pair("Pure Premium Nutella Spread", 100),
    Pair("Roasted Hazelnuts & Caramel", 90)
)

val TOPPINGS = listOf(
    Triple("sprinkles", "Rainbow Sprinkles", 30),
    Triple("cherries", "Maraschino Cherries", 50),
    Triple("strawberries", "Fresh Strawberries", 100),
    Triple("gold_foil", "Edible 24k Gold Foil", 150),
    Triple("ganache_drips", "Dark Chocolate Drips", 60),
    Triple("macarons", "Mini French Macarons", 120),
    Triple("pearls", "Glimmering Pearls", 40)
)

// Primary warm theme shades
val AppPrimary = Color(0xFFD97706) // Amber 600
val AppBg = Color(0xFFFDFBF7) // Warm off-white
val ChocolateDark = Color(0xFF422210) // Rich dark brown
val CocoaAccent = Color(0xFF5A4238) // Medium cocoa accent
val IvoryCream = Color(0xFFFFFBEB) // Soft warm yellow
val GrayLight = Color(0xFFF3F4F6)

// ==========================================
// MAIN ACTIVITY ENTRY
// ==========================================

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                BakeTheoryMain()
            }
        }
    }
}

@Composable
fun BakeTheoryMain() {
    val context = LocalContext.current
    
    // Persistent states
    val ordersTable = remember { mutableStateListOf<CakeOrder>() }
    
    LaunchedEffect(Unit) {
        // Load locally first for instant startup feedback
        val localOrders = loadOrdersFromSharedPrefs(context)
        ordersTable.clear()
        if (localOrders.isEmpty()) {
            ordersTable.addAll(DEFAULT_ORDERS)
        } else {
            ordersTable.addAll(localOrders)
        }
        
        // Polling loop in background thread to sync with central database
        val client = OkHttpClient()
        while (true) {
            try {
                val sharedPrefs = context.getSharedPreferences("BakeTheoryPrefs", Context.MODE_PRIVATE)
                val serverUrl = sharedPrefs.getString("backend_api_url", BACKEND_URL) ?: BACKEND_URL
                
                withContext(Dispatchers.IO) {
                    val request = Request.Builder()
                        .url("$serverUrl/api/orders")
                        .build()
                    client.newCall(request).execute().use { response ->
                        if (response.isSuccessful) {
                            val bodyString = response.body?.string()
                            if (!bodyString.isNullOrEmpty()) {
                                val arr = JSONArray(bodyString)
                                val loaded = mutableListOf<CakeOrder>()
                                for (i in 0 until arr.length()) {
                                    loaded.add(jsonToCakeOrder(arr.getJSONObject(i)))
                                }
                                withContext(Dispatchers.Main) {
                                    ordersTable.clear()
                                    ordersTable.addAll(loaded)
                                    
                                    val localPrefs = context.getSharedPreferences("BakeTheoryPrefs", Context.MODE_PRIVATE)
                                    val localArr = JSONArray()
                                    loaded.forEach { localArr.put(cakeOrderToJson(it)) }
                                    localPrefs.edit().putString("saved_orders", localArr.toString()).apply()
                                }
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                println("BakeTheory-API: Poll error: ${e.message}")
            }
            kotlinx.coroutines.delay(10000)
        }
    }
    var activeTab by remember { mutableStateOf(Tab.SHOWROOM) }
    
    // Custom Designer Form States
    var cakeSize by remember { mutableStateOf(1.0) }
    var cakeTiers by remember { mutableStateOf(1) }
    var cakeShape by remember { mutableStateOf("round") }
    var cakeFlavor by remember { mutableStateOf("Classic Vanilla Bean") }
    var cakeFrosting by remember { mutableStateOf("Silky Buttercream") }
    var cakeFilling by remember { mutableStateOf("Standard Custard / Cream") }
    var cakeAccentColor by remember { mutableStateOf("#FFD3DF") }
    val selectedToppings = remember { mutableStateListOf<String>() }
    var customMessage by remember { mutableStateOf("") }
    var specialNotes by remember { mutableStateOf("") }
    
    var deliveryType by remember { mutableStateOf("pickup") }
    var deliveryAddress by remember { mutableStateOf("") }
    var deliveryDate by remember { mutableStateOf("2026-05-25") }
    var deliveryTime by remember { mutableStateOf("16:00") }
    
    var checkoutName by remember { mutableStateOf("") }
    var checkoutPhone by remember { mutableStateOf("") }
    var checkoutEmail by remember { mutableStateOf("") }
    
    var stepState by remember { mutableStateOf(Step.SIZING) }
    var submittedOrderRecord by remember { mutableStateOf<CakeOrder?>(null) }
    
    // Gallery lists filter states
    var searchKeyword by remember { mutableStateOf("") }
    var activeFilterTag by remember { mutableStateOf("All") }
    
    // Customer status lookup
    var trackingMobileNumber by remember { mutableStateOf("") }
    var lookUpExecuted by remember { mutableStateOf(false) }
    
    // Admin login gates
    var isOwnerLoggedIn by remember { mutableStateOf(false) }
    var passcodeInput by remember { mutableStateOf("") }
    var passError by remember { mutableStateOf("") }
    
    // Admin selected edits
    var activeAdminOrder by remember { mutableStateOf<CakeOrder?>(null) }
    var editStatus by remember { mutableStateOf("pending") }
    var editPaymentStatus by remember { mutableStateOf("unpaid") }
    var editPaymentMethod by remember { mutableStateOf("upi") }
    var editCustomSurcharge by remember { mutableStateOf(0) }
    var editDiscountValue by remember { mutableStateOf(0) }
    var editLedgerNotes by remember { mutableStateOf("") }
    var renderInvoiceModal by remember { mutableStateOf(false) }

    // Global helper helper to populate custom fields starting from a Signature cake
    fun triggerCustomDesignSession(cake: SignatureCake) {
        cakeSize = cake.baseSize
        cakeTiers = cake.baseTiers
        cakeShape = cake.baseShape
        cakeFlavor = cake.baseFlavor
        cakeFrosting = cake.baseFrosting
        cakeFilling = cake.baseFilling
        cakeAccentColor = cake.baseColor
        selectedToppings.clear()
        selectedToppings.addAll(cake.baseToppings)
        specialNotes = "Adjusted configuration starting from the signature cake base: '${cake.name}'"
        builderStepReset()
        stepState = Step.FLAVOR
        activeTab = Tab.DESIGNER
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = AppBg
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(IvoryCream)
                    .statusBarsPadding()
                    .padding(top = 8.dp, bottom = 8.dp, start = 12.dp, end = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(AppPrimary, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Canvas(modifier = Modifier.size(18.dp)) {
                                val w = size.width
                                val h = size.height
                                // Plate
                                drawRect(
                                    color = Color.White,
                                    topLeft = androidx.compose.ui.geometry.Offset(w * 0.1f, h * 0.85f),
                                    size = androidx.compose.ui.geometry.Size(w * 0.8f, h * 0.08f)
                                )
                                // Bottom layer
                                drawRect(
                                    color = Color.White,
                                    topLeft = androidx.compose.ui.geometry.Offset(w * 0.2f, h * 0.52f),
                                    size = androidx.compose.ui.geometry.Size(w * 0.6f, h * 0.3f)
                                )
                                // Top layer
                                drawRect(
                                    color = Color.White,
                                    topLeft = androidx.compose.ui.geometry.Offset(w * 0.32f, h * 0.24f),
                                    size = androidx.compose.ui.geometry.Size(w * 0.36f, h * 0.26f)
                                )
                                // Candle
                                drawRect(
                                    color = Color.White,
                                    topLeft = androidx.compose.ui.geometry.Offset(w * 0.47f, h * 0.08f),
                                    size = androidx.compose.ui.geometry.Size(w * 0.06f, h * 0.14f)
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "Bake Theory",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Serif,
                                    color = ChocolateDark
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .background(Color(0xFFFEF3C7), RoundedCornerShape(100.dp))
                                        .padding(horizontal = 5.dp, vertical = 1.5.dp)
                                ) {
                                    Text(
                                        text = "HOME KITCHEN",
                                        fontSize = 7.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF78350F)
                                    )
                                }
                            }
                            Text(
                                text = "Premium Custom Cakes • Baked with Love & Science",
                                fontSize = 10.sp,
                                color = CocoaAccent,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                    
                    IconButton(
                        onClick = {
                            val uri = Uri.parse("https://wa.me/917990466936")
                            context.startActivity(Intent(Intent.ACTION_VIEW, uri))
                        },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Phone,
                            contentDescription = "Contact Desk",
                            tint = AppPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(10.dp))
                
                // TABBED INTERACTION BAR
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    TabButton(
                        label = "Gallery",
                        isSelected = activeTab == Tab.SHOWROOM,
                        icon = Icons.Default.List,
                        onSelect = { activeTab = Tab.SHOWROOM },
                        modifier = Modifier.weight(1f)
                    )
                    TabButton(
                        label = "Designer",
                        isSelected = activeTab == Tab.DESIGNER,
                        icon = Icons.Default.ShoppingCart,
                        onSelect = { activeTab = Tab.DESIGNER },
                        modifier = Modifier.weight(1f)
                    )
                    TabButton(
                        label = "Orders",
                        isSelected = activeTab == Tab.STATUS,
                        icon = Icons.Default.Phone,
                        onSelect = { activeTab = Tab.STATUS },
                        modifier = Modifier.weight(1f)
                    )
                    TabButton(
                        label = "Admin",
                        isSelected = activeTab == Tab.ADMIN,
                        icon = Icons.Default.Lock,
                        onSelect = { activeTab = Tab.ADMIN },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
            
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
            when (activeTab) {
                Tab.SHOWROOM -> {
                    ShowroomScreen(
                        searchKeyword = searchKeyword,
                        onKeywordChange = { searchKeyword = it },
                        activeFilterTag = activeFilterTag,
                        onSelectFilterTag = { activeFilterTag = it },
                        onQuickOrder = { triggerCustomDesignSession(it) }
                    )
                }
                Tab.DESIGNER -> {
                    DesignerStepScreen(
                        cakeSize = cakeSize,
                        onSizeChange = { cakeSize = it },
                        cakeTiers = cakeTiers,
                        onTiersChange = { cakeTiers = it },
                        cakeShape = cakeShape,
                        onShapeChange = { cakeShape = it },
                        cakeFlavor = cakeFlavor,
                        onFlavorChange = { cakeFlavor = it },
                        cakeFrosting = cakeFrosting,
                        onFrostingChange = { cakeFrosting = it },
                        cakeFilling = cakeFilling,
                        onFillingChange = { cakeFilling = it },
                        accentColor = cakeAccentColor,
                        onAccentColorChange = { cakeAccentColor = it },
                        selectedToppings = selectedToppings,
                        customMessage = customMessage,
                        onMessageChange = { customMessage = it },
                        specialNotes = specialNotes,
                        onNotesChange = { specialNotes = it },
                        deliveryType = deliveryType,
                        onDeliveryTypeChange = { deliveryType = it },
                        deliveryAddress = deliveryAddress,
                        onDeliveryAddressChange = { deliveryAddress = it },
                        deliveryDate = deliveryDate,
                        onDeliveryDateChange = { deliveryDate = it },
                        deliveryTime = deliveryTime,
                        onDeliveryTimeChange = { deliveryTime = it },
                        checkoutName = checkoutName,
                        onCheckoutNameChange = { checkoutName = it },
                        checkoutPhone = checkoutPhone,
                        onCheckoutPhoneChange = { checkoutPhone = it },
                        checkoutEmail = checkoutEmail,
                        onCheckoutEmailChange = { checkoutEmail = it },
                        stepState = stepState,
                        onStepChange = { stepState = it },
                        submittedOrderRecord = submittedOrderRecord,
                        onOrderSubmit = { order ->
                            ordersTable.add(0, order)
                            saveOrdersToSharedPrefs(context, ordersTable)
                            submittedOrderRecord = order
                            stepState = Step.SUCCESS
                        },
                        onResetDesigner = {
                            cakeSize = 1.0
                            cakeTiers = 1
                            cakeShape = "round"
                            cakeFlavor = "Classic Vanilla Bean"
                            cakeFrosting = "Silky Buttercream"
                            cakeFilling = "Standard Custard / Cream"
                            cakeAccentColor = "#FFD3DF"
                            selectedToppings.clear()
                            customMessage = ""
                            specialNotes = ""
                            checkoutName = ""
                            checkoutPhone = ""
                            checkoutEmail = ""
                            deliveryAddress = ""
                            stepState = Step.SIZING
                            submittedOrderRecord = null
                        }
                    )
                }
                Tab.STATUS -> {
                    StatusScreen(
                        trackingMobileNumber = trackingMobileNumber,
                        onPhoneChange = { trackingMobileNumber = it },
                        lookUpExecuted = lookUpExecuted,
                        onExecuteSearch = { lookUpExecuted = true },
                        onResetSearch = {
                            trackingMobileNumber = ""
                            lookUpExecuted = false
                        },
                        ordersTable = ordersTable
                    )
                }
                Tab.ADMIN -> {
                    AdminScreen(
                        isOwnerLoggedIn = isOwnerLoggedIn,
                        passcodeInput = passcodeInput,
                        onPasscodeChange = { passcodeInput = it },
                        passError = passError,
                        onTryLogin = {
                            if (passcodeInput == "bake7990" || passcodeInput == "7990466936") {
                                isOwnerLoggedIn = true
                                passError = ""
                            } else {
                                passError = "Access denied! Invalid passcode."
                            }
                        },
                        onLogout = {
                            isOwnerLoggedIn = false
                            passcodeInput = ""
                            activeAdminOrder = null
                        },
                        ordersTable = ordersTable,
                        activeAdminOrder = activeAdminOrder,
                        onSelectAdminOrder = { ord ->
                            activeAdminOrder = ord
                            if (ord != null) {
                                editStatus = ord.orderStatus
                                editPaymentStatus = ord.paymentStatus
                                editPaymentMethod = ord.paymentMethod
                                editCustomSurcharge = ord.decorSurcharge
                                editDiscountValue = ord.discount
                                editLedgerNotes = ord.paymentNotes
                            }
                        },
                        editStatus = editStatus,
                        onStatusChange = { editStatus = it },
                        editPaymentStatus = editPaymentStatus,
                        onPaidStatusChange = { editPaymentStatus = it },
                        editPaymentMethod = editPaymentMethod,
                        onPaymentMethodChange = { editPaymentMethod = it },
                        editCustomSurcharge = editCustomSurcharge,
                        onSurchargeChange = { editCustomSurcharge = it },
                        editDiscountValue = editDiscountValue,
                        onDiscountChange = { editDiscountValue = it },
                        editLedgerNotes = editLedgerNotes,
                        onLedgerNotesChange = { editLedgerNotes = it },
                        onSaveChanges = {
                            val ord = activeAdminOrder
                            if (ord != null) {
                                val idx = ordersTable.indexOfFirst { it.id == ord.id }
                                if (idx != -1) {
                                    val original = ordersTable[idx]
                                    val newBaseTotal = original.basePrice + original.flavorSurcharge + original.tiersSurcharge + editCustomSurcharge + original.deliveryFee - editDiscountValue
                                    val updated = original.copy(
                                        orderStatus = editStatus,
                                        paymentStatus = editPaymentStatus,
                                        paymentMethod = editPaymentMethod,
                                        decorSurcharge = editCustomSurcharge,
                                        discount = editDiscountValue,
                                        totalPrice = newBaseTotal,
                                        paymentNotes = editLedgerNotes,
                                        amountPaid = if (editPaymentStatus == "paid_in_full") newBaseTotal else if (editPaymentStatus == "unpaid") 0 else original.depositAmount
                                    )
                                    ordersTable[idx] = updated
                                    saveOrdersToSharedPrefs(context, ordersTable)
                                    activeAdminOrder = updated
                                    Toast.makeText(context, "Ledger system updated successfully!", Toast.LENGTH_SHORT).show()
                                }
                            }
                        },
                        renderInvoiceModal = renderInvoiceModal,
                        onSetInvoiceModal = { renderInvoiceModal = it }
                    )
                }
            }
        }
    }
}

private fun builderStepReset() {}

// ==========================================
// SUB-UI RENDERS
// ==========================================

@Composable
fun TabButton(
    label: String,
    isSelected: Boolean,
    icon: ImageVector,
    onSelect: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .background(
                if (isSelected) AppPrimary else Color.Transparent,
                RoundedCornerShape(8.dp)
            )
            .border(
                1.dp,
                if (isSelected) AppPrimary else CocoaAccent.copy(alpha = 0.2f),
                RoundedCornerShape(8.dp)
            )
            .clickable { onSelect() }
            .padding(vertical = 8.dp, horizontal = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (isSelected) Color.White else CocoaAccent,
                modifier = Modifier.size(14.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = label,
                color = if (isSelected) Color.White else ChocolateDark,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// ----------------------------------------------------
// SCREEN 1: SHOWROOM GALLERY SCREEN
// ----------------------------------------------------
@Composable
fun ShowroomScreen(
    searchKeyword: String,
    onKeywordChange: (String) -> Unit,
    activeFilterTag: String,
    onSelectFilterTag: (String) -> Unit,
    onQuickOrder: (SignatureCake) -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = IvoryCream),
        border = BorderStroke(1.dp, AppPrimary.copy(alpha = 0.15f)),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Our Royal Recipe Showroom",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                color = ChocolateDark
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Browse our signature creations. Select one to automatically populate custom design parameters, sizes, and flavors!",
                fontSize = 12.sp,
                color = CocoaAccent,
                lineHeight = 16.sp
            )
        }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // Filters search panel
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        OutlinedTextField(
            value = searchKeyword,
            onValueChange = onKeywordChange,
            placeholder = { Text("Search creations...", fontSize = 12.sp) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", modifier = Modifier.size(16.dp)) },
            modifier = Modifier
                .weight(1f)
                .height(52.dp),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = AppPrimary,
                unfocusedBorderColor = CocoaAccent.copy(alpha = 0.2f)
            )
        )
    }

    Spacer(modifier = Modifier.height(10.dp))

    // Horizontal category tags
    val tags = listOf("All", "Birthday", "Anniversary", "Chocolate", "Romance", "Kids", "Elegant")
    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        items(tags) { tag ->
            Box(
                modifier = Modifier
                    .background(
                        if (activeFilterTag == tag) AppPrimary else Color.White,
                        RoundedCornerShape(8.dp)
                    )
                    .border(
                        1.dp,
                        if (activeFilterTag == tag) AppPrimary else CocoaAccent.copy(alpha = 0.15f),
                        RoundedCornerShape(8.dp)
                    )
                    .clickable { onSelectFilterTag(tag) }
                    .padding(vertical = 6.dp, horizontal = 12.dp)
            ) {
                Text(
                    text = tag,
                    color = if (activeFilterTag == tag) Color.White else ChocolateDark,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }

    Spacer(modifier = Modifier.height(14.dp))

    val filteredCakes = DEFAULT_SIGNATURE_CAKES.filter { cake ->
        val matchesSearch = cake.name.contains(searchKeyword, ignoreCase = true) ||
                cake.description.contains(searchKeyword, ignoreCase = true) ||
                cake.tags.any { it.contains(searchKeyword, ignoreCase = true) }
        val matchesTag = activeFilterTag == "All" || cake.tags.contains(activeFilterTag)
        matchesSearch && matchesTag
    }

    if (filteredCakes.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 40.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "No cakes match your query, try search tags!",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = CocoaAccent
            )
        }
    } else {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            filteredCakes.forEach { cake ->
                ShowroomCakeCard(cake = cake, onSelect = { onQuickOrder(cake) })
            }
        }
    }
}

@Composable
fun ShowroomCakeCard(cake: SignatureCake, onSelect: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            // High-quality premium cake photograph
            AsyncImage(
                model = cake.image,
                contentDescription = cake.name,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentScale = ContentScale.Crop
            )

            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = cake.name,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = ChocolateDark,
                        fontFamily = FontFamily.Serif
                    )
                    Text(
                        text = "₹${cake.price}",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = AppPrimary,
                        fontFamily = FontFamily.Monospace
                    )
                }
                
                Spacer(modifier = Modifier.height(6.dp))
                
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    cake.tags.forEach { tag ->
                        Box(
                            modifier = Modifier
                                .background(Color(0xFFFEF3C7), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(text = tag, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF92400E))
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = cake.description,
                    fontSize = 12.sp,
                    color = CocoaAccent,
                    lineHeight = 16.sp
                )
                
                Spacer(modifier = Modifier.height(10.dp))
                
                // Specifications metadata summary
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(GrayLight)
                        .padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("DIMENSION SIZE", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                        Text("${cake.baseSize} kg (${cake.baseTiers} Tier)", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Column {
                        Text("SIGNATURE FLAVOR", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                        Text(cake.baseFlavor, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Button(
                    onClick = onSelect,
                    colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Default.Star, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Customize & Quick-Order", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// ----------------------------------------------------
// SCREEN 2: CUSTOM STEP-BY-STEP DESIGNER
// ----------------------------------------------------
@Composable
fun DesignerStepScreen(
    cakeSize: Double,
    onSizeChange: (Double) -> Unit,
    cakeTiers: Int,
    onTiersChange: (Int) -> Unit,
    cakeShape: String,
    onShapeChange: (String) -> Unit,
    cakeFlavor: String,
    onFlavorChange: (String) -> Unit,
    cakeFrosting: String,
    onFrostingChange: (String) -> Unit,
    cakeFilling: String,
    onFillingChange: (String) -> Unit,
    accentColor: String,
    onAccentColorChange: (String) -> Unit,
    selectedToppings: List<String>,
    customMessage: String,
    onMessageChange: (String) -> Unit,
    specialNotes: String,
    onNotesChange: (String) -> Unit,
    deliveryType: String,
    onDeliveryTypeChange: (String) -> Unit,
    deliveryAddress: String,
    onDeliveryAddressChange: (String) -> Unit,
    deliveryDate: String,
    onDeliveryDateChange: (String) -> Unit,
    deliveryTime: String,
    onDeliveryTimeChange: (String) -> Unit,
    checkoutName: String,
    onCheckoutNameChange: (String) -> Unit,
    checkoutPhone: String,
    onCheckoutPhoneChange: (String) -> Unit,
    checkoutEmail: String,
    onCheckoutEmailChange: (String) -> Unit,
    stepState: Step,
    onStepChange: (Step) -> Unit,
    submittedOrderRecord: CakeOrder?,
    onOrderSubmit: (CakeOrder) -> Unit,
    onResetDesigner: () -> Unit
) {
    val context = LocalContext.current
    
    // Live Dynamic total computations
    val basePrice = when (cakeSize) {
        0.5 -> 500
        1.0 -> 950
        1.5 -> 1400
        2.0 -> 1800
        3.0 -> 2600
        else -> 950
    }
    val flSurcharge = (FLAVORS.find { it.first == cakeFlavor }?.second ?: 0) * cakeSize
    val frSurcharge = FROSTINGS.find { it.first == cakeFrosting }?.second ?: 0
    val fillSurcharge = (FILLINGS.find { it.first == cakeFilling }?.second ?: 0) * cakeSize
    val shSurcharge = SHAPES.find { it.first == cakeShape }?.third ?: 0
    val tierSurcharge = if (cakeTiers == 2) 300 else if (cakeTiers == 3) 600 else 0
    
    var toppingSurchargeSum = 0
    selectedToppings.forEach { id ->
        toppingSurchargeSum += TOPPINGS.find { it.first == id }?.third ?: 0
    }
    
    val calculatedDecor = frSurcharge + fillSurcharge.toInt() + shSurcharge + toppingSurchargeSum
    val deliveryFee = if (deliveryType == "delivery") 100 else 0
    val finalSum = basePrice + flSurcharge.toInt() + tierSurcharge + calculatedDecor + deliveryFee
    
    // Custom progress layout
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        StepProgressUnit(label = "Sizes", isPassed = true, isActive = stepState == Step.SIZING)
        StepProgressUnit(label = "Flavors", isPassed = stepState != Step.SIZING, isActive = stepState == Step.FLAVOR)
        StepProgressUnit(label = "Aesthetic", isPassed = stepState != Step.SIZING && stepState != Step.FLAVOR, isActive = stepState == Step.AESTHETICS)
        StepProgressUnit(label = "Logistics", isPassed = stepState == Step.CUSTOMER || stepState == Step.SUCCESS, isActive = stepState == Step.CUSTOMER)
    }

    Spacer(modifier = Modifier.height(14.dp))

    when (stepState) {
        Step.SIZING -> {
            Text("Sizing, Structure & Geometry", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
            Spacer(modifier = Modifier.height(10.dp))
            
            // Sizes row buttons Selection
            Text("Select Baseline Weight Size (kg)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            SIZES.forEach { (kg, txt) ->
                val price = when (kg) {
                    0.5 -> 500
                    1.0 -> 950
                    1.5 -> 1400
                    2.0 -> 1800
                    3.0 -> 2600
                    else -> 950
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .background(if (cakeSize == kg) IvoryCream else Color.White, RoundedCornerShape(8.dp))
                        .border(
                            1.dp,
                            if (cakeSize == kg) AppPrimary else Color.Gray.copy(alpha = 0.2f),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onSizeChange(kg) }
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RadioButton(selected = cakeSize == kg, onClick = { onSizeChange(kg) })
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(txt, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Text("₹$price", fontSize = 13.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = AppPrimary)
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Tiers selection row
            Text("Specify Structural Multi-Tiers Stack Build", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(1, 2, 3).forEach { tier ->
                    val surcharge = if (tier == 2) 300 else if (tier == 3) 600 else 0
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(if (cakeTiers == tier) IvoryCream else Color.White, RoundedCornerShape(8.dp))
                            .border(
                                1.dp,
                                if (cakeTiers == tier) AppPrimary else Color.Gray.copy(alpha = 0.2f),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { onTiersChange(tier) }
                            .padding(10.dp)
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "$tier Tier${if (tier > 1) "s" else ""}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = ChocolateDark,
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = if (surcharge > 0) "+₹$surcharge" else "Standard",
                                fontSize = 10.sp,
                                color = AppPrimary,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Geometric Shape Selection
            Text("Select Geometric Crust Shape Form", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                SHAPES.forEach { (id, name, value) ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(if (cakeShape == id) IvoryCream else Color.White, RoundedCornerShape(8.dp))
                            .border(
                                1.dp,
                                if (cakeShape == id) AppPrimary else Color.Gray.copy(alpha = 0.2f),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { onShapeChange(id) }
                            .padding(8.dp)
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = name.replace("Charming ", "").replace("Romantic ", "").replace("Modern ", "").replace("Geometric ", ""),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = ChocolateDark,
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = if (value > 0) "+₹$value" else "Free",
                                fontSize = 10.sp,
                                color = AppPrimary,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Pricing real-time indicators
            DesignPricingBanner(finalPrice = finalSum)

            Spacer(modifier = Modifier.height(10.dp))

            Button(
                onClick = { onStepChange(Step.FLAVOR) },
                colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Select Sponge Flavor & Crème >", fontWeight = FontWeight.Bold)
            }
        }
        Step.FLAVOR -> {
            Text("Sponge Flavors, Inner Cream & Cover", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
            Spacer(modifier = Modifier.height(10.dp))

            Text("Select Sponge Flavor Layer", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            FLAVORS.forEach { (flavor, surcharge, desc) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .background(if (cakeFlavor == flavor) IvoryCream else Color.White, RoundedCornerShape(8.dp))
                        .border(
                            1.dp,
                            if (cakeFlavor == flavor) AppPrimary else Color.Gray.copy(alpha = 0.2f),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onFlavorChange(flavor) }
                        .padding(10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(flavor, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
                        Text(desc, fontSize = 11.sp, color = Color.Gray)
                    }
                    Text(
                        text = if (surcharge > 0) "+₹$surcharge/kg" else "Standard",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AppPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text("Select Outer Frosting Layer Coating", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            FROSTINGS.forEach { (frosting, surcharge, desc) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .background(if (cakeFrosting == frosting) IvoryCream else Color.White, RoundedCornerShape(8.dp))
                        .border(
                            1.dp,
                            if (cakeFrosting == frosting) AppPrimary else Color.Gray.copy(alpha = 0.2f),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onFrostingChange(frosting) }
                        .padding(10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(frosting, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
                        Text(desc, fontSize = 11.sp, color = Color.Gray)
                    }
                    Text(
                        text = if (surcharge > 0) "+₹$surcharge" else "Standard",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AppPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text("Select Inner Core Filings Cream", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            FILLINGS.forEach { (filling, surcharge) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .background(if (cakeFilling == filling) IvoryCream else Color.White, RoundedCornerShape(8.dp))
                        .border(
                            1.dp,
                            if (cakeFilling == filling) AppPrimary else Color.Gray.copy(alpha = 0.2f),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onFillingChange(filling) }
                        .padding(10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(filling, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
                    Text(
                        text = if (surcharge > 0) "+₹$surcharge/kg" else "Standard",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AppPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
            DesignPricingBanner(finalPrice = finalSum)
            Spacer(modifier = Modifier.height(10.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { onStepChange(Step.SIZING) },
                    modifier = Modifier.weight(0.4f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("< Size")
                }
                Button(
                    onClick = { onStepChange(Step.AESTHETICS) },
                    modifier = Modifier.weight(0.6f),
                    colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Design & Aesthetics >", fontWeight = FontWeight.Bold)
                }
            }
        }
        Step.AESTHETICS -> {
            Text("Visual Styling & Hand Inscriptions", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
            Spacer(modifier = Modifier.height(12.dp))

            // Dynamic live preview drawer
            Text("Interactive Dynamic Handcraft Preview", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
            Spacer(modifier = Modifier.height(4.dp))
            InterActiveCakePreview(
                sizeKg = cakeSize,
                tiers = cakeTiers,
                shape = cakeShape,
                accentColorHex = accentColor,
                toppings = selectedToppings
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Dynamic Palette color selectors
            Text("Specify Paste Accent Shades Tone", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            val colors = listOf(
                Pair("#FFD3DF", "Vibrant Rose"),
                Pair("#EEDAA2", "Warm Honey"),
                Pair("#4E3629", "Choco Fudge"),
                Pair("#E2D4F0", "Lavender"),
                Pair("#C2F0E2", "Seafoam Mint"),
                Pair("#FFFFFF", "Lily White")
            )
            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                items(colors) { (hex, nm) ->
                    Box(
                        modifier = Modifier
                            .background(Color(android.graphics.Color.parseColor(hex)), RoundedCornerShape(8.dp))
                            .border(
                                2.dp,
                                if (accentColor == hex) AppPrimary else Color.Gray.copy(alpha = 0.2f),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { onAccentColorChange(hex) }
                            .padding(vertical = 10.dp, horizontal = 12.dp)
                    ) {
                        Text(
                            text = nm,
                            color = if (hex == "#FFFFFF") Color.Black else if (hex == "#EEDAA2" || hex == "#C2F0E2") Color(0xFF333333) else Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Checkbox toppings elements
            Text("Select Top Toppings Decking Accents", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Spacer(modifier = Modifier.height(6.dp))
            TOPPINGS.forEach { (id, name, price) ->
                val contains = selectedToppings.contains(id)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            val list = selectedToppings.toMutableList()
                            if (contains) list.remove(id) else list.add(id)
                            val toppingsField = selectedToppings as MutableList<String>
                            toppingsField.clear()
                            toppingsField.addAll(list)
                        }
                        .padding(vertical = 2.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(checked = contains, onCheckedChange = {
                            val list = selectedToppings.toMutableList()
                            if (contains) list.remove(id) else list.add(id)
                            val toppingsField = selectedToppings as MutableList<String>
                            toppingsField.clear()
                            toppingsField.addAll(list)
                        })
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(name, fontSize = 13.sp)
                    }
                    Text("+₹$price", fontSize = 12.sp, color = AppPrimary, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text("Hand Calligraphy Text Inscription On Top", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            OutlinedTextField(
                value = customMessage,
                onValueChange = onMessageChange,
                placeholder = { Text("e.g., Happy 25th birthday Preeti!", fontSize = 12.sp) },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 1,
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text("Special Bakery Specifications (Eggless / Instructions)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            OutlinedTextField(
                value = specialNotes,
                onValueChange = onNotesChange,
                placeholder = { Text("Describe dietary needs, packaging specs...", fontSize = 12.sp) },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
            )

            Spacer(modifier = Modifier.height(20.dp))
            DesignPricingBanner(finalPrice = finalSum)
            Spacer(modifier = Modifier.height(10.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { onStepChange(Step.FLAVOR) },
                    modifier = Modifier.weight(0.4f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("< Taste")
                }
                Button(
                    onClick = { onStepChange(Step.CUSTOMER) },
                    modifier = Modifier.weight(0.6f),
                    colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Logistics & Contact Info >", fontWeight = FontWeight.Bold)
                }
            }
        }
        Step.CUSTOMER -> {
            Text("Handoff Logistics, Timing & Billing Info", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
            Spacer(modifier = Modifier.height(10.dp))

            Text("Select Handover Logistics System", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(if (deliveryType == "pickup") IvoryCream else Color.White, RoundedCornerShape(8.dp))
                        .border(
                            1.dp,
                            if (deliveryType == "pickup") AppPrimary else Color.Gray.copy(alpha = 0.2f),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onDeliveryTypeChange("pickup") }
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("In-Store Pickup (FREE)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(if (deliveryType == "delivery") IvoryCream else Color.White, RoundedCornerShape(8.dp))
                        .border(
                            1.dp,
                            if (deliveryType == "delivery") AppPrimary else Color.Gray.copy(alpha = 0.2f),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onDeliveryTypeChange("delivery") }
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Doorstep Delivery (+₹100)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            if (deliveryType == "delivery") {
                Spacer(modifier = Modifier.height(10.dp))
                Text("Specify Physical Delivery Address", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
                OutlinedTextField(
                    value = deliveryAddress,
                    onValueChange = onDeliveryAddressChange,
                    placeholder = { Text("Flat/Street door address...", fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Delivery/Pickup Date", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
                    OutlinedTextField(
                        value = deliveryDate,
                        onValueChange = onDeliveryDateChange,
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                    )
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text("Handoff Time", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
                    OutlinedTextField(
                        value = deliveryTime,
                        onValueChange = onDeliveryTimeChange,
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text("Custody Contact Name", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
            OutlinedTextField(
                value = checkoutName,
                onValueChange = onCheckoutNameChange,
                placeholder = { Text("Enter full recipient name", fontSize = 12.sp) },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Custody Mobile Phone", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
                    OutlinedTextField(
                        value = checkoutPhone,
                        onValueChange = onCheckoutPhoneChange,
                        placeholder = { Text("e.g. 9876543210", fontSize = 12.sp) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                    )
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text("Billing Email Address", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
                    OutlinedTextField(
                        value = checkoutEmail,
                        onValueChange = onCheckoutEmailChange,
                        placeholder = { Text("e.g. bill@gmail.com", fontSize = 12.sp) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
            DesignPricingBanner(finalPrice = finalSum)
            Spacer(modifier = Modifier.height(10.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { onStepChange(Step.AESTHETICS) },
                    modifier = Modifier.weight(0.4f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("< Aesthetic")
                }
                Button(
                    onClick = {
                        if (checkoutName.isBlank() || checkoutPhone.isBlank()) {
                            Toast.makeText(context, "Please fill in recipient name and mobile phone details!", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        val rando = (1001..9999).random()
                        val newOrder = CakeOrder(
                            id = "BT-$rando",
                            customerName = checkoutName,
                            customerPhone = checkoutPhone,
                            customerEmail = checkoutEmail,
                            pickupOrDelivery = deliveryType,
                            deliveryAddress = deliveryAddress,
                            deliveryDate = deliveryDate,
                            deliveryTime = deliveryTime,
                            sizeKg = cakeSize,
                            tiers = cakeTiers,
                            shape = cakeShape,
                            flavor = cakeFlavor,
                            frosting = cakeFrosting,
                            filling = cakeFilling,
                            accentColor = accentColor,
                            customMessage = customMessage,
                            toppings = selectedToppings.toList(),
                            specialNotes = specialNotes,
                            basePrice = basePrice,
                            flavorSurcharge = flSurcharge.toInt(),
                            tiersSurcharge = tierSurcharge,
                            decorSurcharge = calculatedDecor,
                            deliveryFee = deliveryFee,
                            discount = 0,
                            totalPrice = finalSum,
                            paymentStatus = "unpaid",
                            paymentMethod = "upi",
                            depositAmount = 0,
                            amountPaid = 0,
                            orderStatus = "pending",
                            createdAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault()).format(Date())
                        )
                        onOrderSubmit(newOrder)
                    },
                    modifier = Modifier.weight(0.6f),
                    colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Complete Handcraft Order Proposal", fontWeight = FontWeight.Bold, fontSize = 11.sp)
                }
            }
        }
        Step.SUCCESS -> {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFECFDF5)),
                border = BorderStroke(1.dp, Color(0xFF10B981)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Default.CheckCircle, contentDescription = "Checked", tint = Color(0xFF10B981), modifier = Modifier.size(30.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Handcraft Order Proposal Saved!", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF065F46))
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Your custom proposal record is successfully updated in our local ledger. To finalize construction details and unlock your oven spot, hit coordinates below to hand off order via WhatsApp!",
                        fontSize = 12.sp,
                        color = Color(0xFF047857),
                        lineHeight = 16.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            submittedOrderRecord?.let { ord ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Color.LightGray.copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Proposal ID:", fontSize = 12.sp, color = Color.Gray)
                            Text(ord.id, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
                        }
                        Row(modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Baseline Size (kg):", fontSize = 12.sp, color = Color.Gray)
                            Text("${ord.sizeKg} kg (${ord.tiers} Tier)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Recipe Custom Flavor:", fontSize = 12.sp, color = Color.Gray)
                            Text(ord.flavor, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                        HorizontalDivider(modifier = Modifier.padding(vertical = 6.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Final Baked Invoice Quote:", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
                            Text("₹${ord.totalPrice}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = AppPrimary, fontFamily = FontFamily.Monospace)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Primary Coordinate on WhatsApp CTA
                Button(
                    onClick = {
                        val txt = """
                            🍰 *BAKE THEORY CUSTOM PROPOSAL* 🍰
                            ------------------------------------------------
                            *Order ID:* ${ord.id}
                            *Customer:* ${ord.customerName}
                            *Phone:* +91 ${ord.customerPhone}
                            *Method:* ${ord.pickupOrDelivery.uppercase()}${if (ord.deliveryAddress.isNotEmpty()) " (${ord.deliveryAddress})" else ""}
                            *Schedule:* ${ord.deliveryDate} @ ${ord.deliveryTime}
                            
                            🎂 *CAKE SPECIFICATIONS*
                            - Size Base: ${ord.sizeKg} kg (${ord.tiers} Tiers Stack)
                            - Shape: ${ord.shape.uppercase()}
                            - Flavor: ${ord.flavor}
                            - Frosting: ${ord.frosting}
                            - Filling: ${ord.filling}
                            - Color Tone: ${ord.accentColor}
                            - Message: "${ord.customMessage}"
                            - Toppings: ${ord.toppings.joinToString(", ")}
                            ${if (ord.specialNotes.isNotEmpty()) "- Special Notes: " + ord.specialNotes else ""}
                            
                            💰 *INVOICE STATEMENT*
                            - Base Cake Price: ₹${ord.basePrice}
                            - Flavor Premium: +₹${ord.flavorSurcharge}
                            - Multi-Tier Build: +₹${ord.tiersSurcharge}
                            - Decoration Trim: +₹${ord.decorSurcharge}
                            - Delivery Charge: +₹${ord.deliveryFee}
                            ------------------------------------------------
                            *Grand Total Quote:* ₹${ord.totalPrice}
                            ------------------------------------------------
                            Please text me back to confirm receipt. Thank you!
                        """.trimIndent()
                        val encodedMsg = URLEncoder.encode(txt, "UTF-8")
                        val uri = Uri.parse("https://wa.me/917990466936?text=$encodedMsg")
                        context.startActivity(Intent(Intent.ACTION_VIEW, uri))
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(imageVector = Icons.Default.Share, contentDescription = null, tint = Color.White)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Coordinate Order details on WhatsApp", fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedButton(
                onClick = onResetDesigner,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Start designing a new Custom Cake")
            }
        }
    }
}

@Composable
fun StepProgressUnit(label: String, isPassed: Boolean, isActive: Boolean) {
    Box(
        modifier = Modifier
            .background(
                if (isActive) AppPrimary else if (isPassed) CocoaAccent.copy(alpha = 0.08f) else Color.Transparent,
                RoundedCornerShape(6.dp)
            )
            .border(
                1.dp,
                if (isActive) AppPrimary else CocoaAccent.copy(alpha = 0.15f),
                RoundedCornerShape(6.dp)
            )
            .padding(vertical = 6.dp, horizontal = 4.dp)
            .fillMaxWidth()
            .wrapContentHeight(),
        contentAlignment = Alignment.Center
    ) {
        Column {
            Text(
                text = label,
                fontSize = 10.sp,
                color = if (isActive) Color.White else ChocolateDark,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
fun DesignPricingBanner(finalPrice: Int) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF7ED)),
        border = BorderStroke(1.dp, Color(0xFFFED7AA)),
        shape = RoundedCornerShape(10.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("ESTIMATED PRICE QUOTE", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFFC2410C))
                Text("Real-time automated computation breakdown details", fontSize = 10.sp, color = Color.Gray)
            }
            Text(
                "₹$finalPrice",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFC2410C),
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

// ----------------------------------------------------
// SCREEN 3: CUSTOMER ORDER LOOKUP & TRACKING SCREEN
// ----------------------------------------------------
@Composable
fun StatusScreen(
    trackingMobileNumber: String,
    onPhoneChange: (String) -> Unit,
    lookUpExecuted: Boolean,
    onExecuteSearch: () -> Unit,
    onResetSearch: () -> Unit,
    ordersTable: List<CakeOrder>
) {
    val context = LocalContext.current
    
    Text("Track Historical Order Proposals", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
    Spacer(modifier = Modifier.height(4.dp))
    Text("Enter your custody mobile phone coordinates to retrieve submitted proposals, confirm status details, and coordinate handoffs.", fontSize = 11.sp, color = CocoaAccent)
    
    Spacer(modifier = Modifier.height(14.dp))

    // Mobile inputs
    OutlinedTextField(
        value = trackingMobileNumber,
        onValueChange = onPhoneChange,
        placeholder = { Text("Enter mobile number e.g. 9876543210") },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
        modifier = Modifier.fillMaxWidth(),
        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
    )

    Spacer(modifier = Modifier.height(10.dp))

    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        if (lookUpExecuted) {
            OutlinedButton(
                onClick = onResetSearch,
                modifier = Modifier.weight(0.4f),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Clear Status")
            }
        }
        Button(
            onClick = {
                if (trackingMobileNumber.length < 8) {
                    Toast.makeText(context, "Please enter a valid mobile number identifier!", Toast.LENGTH_SHORT).show()
                    return@Button
                }
                onExecuteSearch()
            },
            modifier = Modifier.weight(if (lookUpExecuted) 0.6f else 1f),
            colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Launch Status Retrieval Check", fontWeight = FontWeight.Bold)
        }
    }

    if (lookUpExecuted) {
        Spacer(modifier = Modifier.height(20.dp))
        val fits = ordersTable.filter { it.customerPhone == trackingMobileNumber }
        if (fits.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 30.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No custody order records found for '$trackingMobileNumber'!",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = CocoaAccent
                )
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                fits.forEach { ord ->
                    OrderSummaryTrackerCard(ord = ord)
                }
            }
        }
    }
}

@Composable
fun OrderSummaryTrackerCard(ord: CakeOrder) {
    val context = LocalContext.current
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        border = BorderStroke(1.dp, Color.LightGray.copy(alpha = 0.3f)),
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("ORDER ID: ${ord.id}", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = ChocolateDark, fontFamily = FontFamily.Monospace)
                val (color, label) = when (ord.orderStatus) {
                    "pending" -> Pair(Color(0xFFEA580C), "PENDING APPROVED")
                    "approved" -> Pair(Color(0xFF2563EB), "APPROVED OVEN")
                    "baking" -> Pair(Color(0xFF7C3AED), "BAKING ACTIVE")
                    "finishing" -> Pair(Color(0xFFDB2777), "FINISHING TRIM")
                    "ready" -> Pair(Color(0xFF0D9488), "READY HANDOFF")
                    "completed" -> Pair(Color(0xFF16A34A), "COMPLETED LEDGER")
                    else -> Pair(Color(0xFFDC2626), "CANCEL STAT")
                }
                Box(
                    modifier = Modifier
                        .background(color.copy(alpha = 0.1f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(text = label, color = color, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Specs
            Text("🎂 Spec: ${ord.sizeKg} kg (${ord.tiers} Tier) - ${ord.flavor} - ${ord.shape.uppercase()}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            if (ord.customMessage.isNotEmpty()) {
                Text("✍️ Script message: \"${ord.customMessage}\"", fontSize = 11.sp, color = CocoaAccent)
            }
            if (ord.specialNotes.isNotEmpty()) {
                Text("💡 Notes: ${ord.specialNotes}", fontSize = 11.sp, color = Color.Gray)
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text("TOTAL INTEGRAL DUE", fontSize = 8.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                    Text("₹${ord.totalPrice}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = AppPrimary, fontFamily = FontFamily.Monospace)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text("PAYMENT LEDGER STATE", fontSize = 8.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                    val pLabel = when (ord.paymentStatus) {
                        "paid_in_full" -> "Paid Full Ledger"
                        "deposit_paid" -> "Deposit Saved"
                        else -> "Unpaid Booking"
                    }
                    Text(pLabel, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = {
                    val encoded = URLEncoder.encode("Hello, checking status update on my custom Bake Theory order proposal: '${ord.id}'", "UTF-8")
                    val uri = Uri.parse("https://wa.me/917990466936?text=$encoded")
                    context.startActivity(Intent(Intent.ACTION_VIEW, uri))
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366)),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Coordinate Status Handover WhatsApp", fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// ----------------------------------------------------
// SCREEN 4: OWNER ADMIN DASHBOARD PORTAL
// ----------------------------------------------------
@Composable
fun AdminScreen(
    isOwnerLoggedIn: Boolean,
    passcodeInput: String,
    onPasscodeChange: (String) -> Unit,
    passError: String,
    onTryLogin: () -> Unit,
    onLogout: () -> Unit,
    ordersTable: List<CakeOrder>,
    activeAdminOrder: CakeOrder?,
    onSelectAdminOrder: (CakeOrder?) -> Unit,
    editStatus: String,
    onStatusChange: (String) -> Unit,
    editPaymentStatus: String,
    onPaidStatusChange: (String) -> Unit,
    editPaymentMethod: String,
    onPaymentMethodChange: (String) -> Unit,
    editCustomSurcharge: Int,
    onSurchargeChange: (Int) -> Unit,
    editDiscountValue: Int,
    onDiscountChange: (Int) -> Unit,
    editLedgerNotes: String,
    onLedgerNotesChange: (String) -> Unit,
    onSaveChanges: () -> Unit,
    renderInvoiceModal: Boolean,
    onSetInvoiceModal: (Boolean) -> Unit
) {
    if (!isOwnerLoggedIn) {
        Card(
            colors = CardDefaults.cardColors(containerColor = IvoryCream),
            border = BorderStroke(1.dp, AppPrimary.copy(alpha = 0.2f)),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(imageVector = Icons.Default.Lock, contentDescription = "Locked", tint = AppPrimary, modifier = Modifier.size(36.dp))
                Spacer(modifier = Modifier.height(10.dp))
                Text("Bakehouse Owner secure Admin Ledger Guard", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
                Spacer(modifier = Modifier.height(4.dp))
                Text("Enter private administrative passcode access code PIN below to retrieve the ledger lists and update order queue.", fontSize = 11.sp, color = CocoaAccent, textAlign = TextAlign.Center)

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = passcodeInput,
                    onValueChange = onPasscodeChange,
                    placeholder = { Text("Enter owner secret PIN code") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                )

                if (passError.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(passError, color = Color.Red, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = onTryLogin,
                    colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Unlock Admin Ledger Gate", fontWeight = FontWeight.Bold)
                }
            }
        }
    } else {
        // Logged In Dashboard
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Bakehouse Ledger Portal", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
            IconButton(onClick = onLogout) {
                Icon(imageVector = Icons.Default.Close, contentDescription = "Logout", tint = Color.Red)
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Metrics KPI elements
        val pendingCount = ordersTable.count { it.orderStatus == "pending" || it.orderStatus == "baking" }
        val grandRevenue = ordersTable.filter { it.orderStatus != "cancelled" }.sumOf { it.totalPrice }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            KPICard(title = "ACTIVE QUEUES", value = "$pendingCount Bakes", modifier = Modifier.weight(1f))
            KPICard(title = "DECADENT SALES", value = "₹$grandRevenue", modifier = Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(14.dp))

        Text("Select Proposal Ledger Record to Edit", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = CocoaAccent)
        Spacer(modifier = Modifier.height(6.dp))

        // Orders table list
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            ordersTable.forEach { ord ->
                val active = activeAdminOrder?.id == ord.id
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(if (active) IvoryCream else Color.White, RoundedCornerShape(10.dp))
                        .border(
                            1.dp,
                            if (active) AppPrimary else Color.LightGray.copy(alpha = 0.3f),
                            RoundedCornerShape(10.dp)
                        )
                        .clickable { onSelectAdminOrder(ord) }
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(ord.customerName, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text("${ord.id} • ${ord.sizeKg} kg • ${ord.orderStatus.uppercase()}", fontSize = 11.sp, color = Color.Gray)
                    }
                    Text("₹${ord.totalPrice}", fontSize = 13.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                }
            }
        }

        activeAdminOrder?.let { activeOrd ->
            Spacer(modifier = Modifier.height(20.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(14.dp))

            Text("Modifying Ledger specs: #${activeOrd.id}", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = ChocolateDark)
            
            Spacer(modifier = Modifier.height(10.dp))

            // Form edits
            Text("Update Bakery Status Queue", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
            val statuses = listOf("pending", "approved", "baking", "finishing", "ready", "completed", "cancelled")
            LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                items(statuses) { st ->
                    Box(
                        modifier = Modifier
                            .background(if (editStatus == st) AppPrimary else Color.White, RoundedCornerShape(6.dp))
                            .border(1.dp, if (editStatus == st) AppPrimary else Color.Gray.copy(alpha = 0.2f), RoundedCornerShape(6.dp))
                            .clickable { onStatusChange(st) }
                            .padding(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        Text(text = st.uppercase(), color = if (editStatus == st) Color.White else ChocolateDark, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text("Update Payment Status Book", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
            val payments = listOf("unpaid", "deposit_paid", "paid_in_full")
            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                payments.forEach { pay ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(if (editPaymentStatus == pay) AppPrimary else Color.White, RoundedCornerShape(6.dp))
                            .border(1.dp, if (editPaymentStatus == pay) AppPrimary else Color.Gray.copy(alpha = 0.2f), RoundedCornerShape(6.dp))
                            .clickable { onPaidStatusChange(pay) }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = pay.replace("_", " ").uppercase(), color = if (editPaymentStatus == pay) Color.White else ChocolateDark, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Decor Premium Adj. (₹)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    OutlinedTextField(
                        value = editCustomSurcharge.toString(),
                        onValueChange = { onSurchargeChange(it.toIntOrNull() ?: 0) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                    )
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text("Manual Discount (₹)", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    OutlinedTextField(
                        value = editDiscountValue.toString(),
                        onValueChange = { onDiscountChange(it.toIntOrNull() ?: 0) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text("Payment Notes", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
            OutlinedTextField(
                value = editLedgerNotes,
                onValueChange = onLedgerNotesChange,
                placeholder = { Text("Log bank references, cash confirmations...") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = AppPrimary)
            )

            Spacer(modifier = Modifier.height(14.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { onSetInvoiceModal(true) },
                    modifier = Modifier.weight(0.4f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Print Slip")
                }
                Button(
                    onClick = onSaveChanges,
                    modifier = Modifier.weight(0.6f),
                    colors = ButtonDefaults.buttonColors(containerColor = AppPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Save Update Ledger Changes", fontWeight = FontWeight.Bold, fontSize = 11.sp)
                }
            }
        }
    }

    if (renderInvoiceModal && activeAdminOrder != null) {
        val o = activeAdminOrder
        Dialog(onDismissRequest = { onSetInvoiceModal(false) }) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(20.dp)
                        .verticalScroll(rememberScrollState())
                ) {
                    Text(
                        text = "BAKE THEORY HARNESS",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        color = Color.Black,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = "* OFFICIAL FISCAL LEDGER REPORT *",
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color.Gray,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Invoice No: #${o.id}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    Text("Customer: ${o.customerName}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    Text("Date: ${o.deliveryDate} @ ${o.deliveryTime}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    Text("Logistics: ${o.pickupOrDelivery.uppercase()}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    if (o.deliveryAddress.isNotEmpty()) {
                        Text("Address: ${o.deliveryAddress}", fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = Color.Gray)
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))
                    Text("- Base size: ${o.sizeKg} kg (${o.tiers} stack)", fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                    Text("- Flavor sponge: ${o.flavor}", fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                    Text("- Frosting core: ${o.frosting}", fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                    Text("- Filling inner: ${o.filling}", fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                    if (o.customMessage.isNotEmpty()) {
                        Text("- Message: \"${o.customMessage}\"", fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Base cake pricing: ", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        Text("₹${o.basePrice}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Flavor surcharge: ", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        Text("+₹${o.flavorSurcharge}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Stack build tiers: ", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        Text("+₹${o.tiersSurcharge}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Decorations/Toppings: ", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        Text("+₹${o.decorSurcharge}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Delivery dispatch fee: ", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        Text("+₹${o.deliveryFee}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    }
                    if (o.discount > 0) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Discount value: ", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                            Text("-₹${o.discount}", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                    HorizontalDivider(modifier = Modifier.padding(vertical = 6.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("GRAND TOTAL:", fontSize = 13.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                        Text("₹${o.totalPrice}", fontSize = 13.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { onSetInvoiceModal(false) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = AppPrimary)
                    ) {
                        Text("Close Printed slip", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun KPICard(title: String, value: String, modifier: Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = IvoryCream),
        border = BorderStroke(1.dp, Color.LightGray.copy(alpha = 0.3f)),
        shape = RoundedCornerShape(10.dp),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(title, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
            Text(value, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ChocolateDark, fontFamily = FontFamily.Serif)
        }
    }
}

// ----------------------------------------------------
// DYNAMIC LIVE VECTOR PREVIEW: THE CAKE STAND DRAW CANVAS
// ----------------------------------------------------
@Composable
fun InterActiveCakePreview(
    sizeKg: Double,
    tiers: Int,
    shape: String,
    accentColorHex: String,
    toppings: List<String>
) {
    val color = try {
        Color(android.graphics.Color.parseColor(accentColorHex))
    } catch (e: Exception) {
        Color(0xFFFFD3DF) // fallback beautiful baby pink
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp)
            .background(Color(0xFFFFFDF9), RoundedCornerShape(16.dp))
            .border(1.dp, IvoryCream, RoundedCornerShape(16.dp))
            .padding(12.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val canvasWidth = size.width
            val canvasHeight = size.height
            val centerX = canvasWidth / 2

            // Platform standalone pedestals stand lines
            drawRoundRect(
                color = Color(0xFFE2E8F0),
                topLeft = androidx.compose.ui.geometry.Offset(centerX - 90.dp.toPx(), canvasHeight - 20.dp.toPx()),
                size = androidx.compose.ui.geometry.Size(180.dp.toPx(), 10.dp.toPx()),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(8.dp.toPx())
            )
            drawRect(
                color = Color(0xFFCBD5E1),
                topLeft = androidx.compose.ui.geometry.Offset(centerX - 24.dp.toPx(), canvasHeight - 32.dp.toPx()),
                size = androidx.compose.ui.geometry.Size(48.dp.toPx(), 12.dp.toPx())
            )
            drawRoundRect(
                color = Color(0xFF94A3B8),
                topLeft = androidx.compose.ui.geometry.Offset(centerX - 60.dp.toPx(), canvasHeight - 36.dp.toPx()),
                size = androidx.compose.ui.geometry.Size(120.dp.toPx(), 5.dp.toPx())
            )

            // Calculate heights starting from baseline stacked tiers
            val totalHeightPx = 90.dp.toPx()
            val singleTierHeight = totalHeightPx / tiers

            for (i in 0 until tiers) {
                val tierIdx = tiers - 1 - i
                val sizeFactor = 1.0f - (tierIdx * 0.22f)
                val tierWidth = 140.dp.toPx() * sizeFactor
                val tierHeight = singleTierHeight - 4.dp.toPx()

                val startX = centerX - (tierWidth / 2)
                val startY = (canvasHeight - 38.dp.toPx()) - ((tierIdx + 1) * singleTierHeight)

                // Render dynamic cake colored sponge bodies
                drawRoundRect(
                    color = color,
                    topLeft = androidx.compose.ui.geometry.Offset(startX, startY),
                    size = androidx.compose.ui.geometry.Size(tierWidth, tierHeight),
                    cornerRadius = androidx.compose.ui.geometry.CornerRadius(6.dp.toPx())
                )

                if (shape == "square") {
                    drawRoundRect(
                        color = Color(0x33000000),
                        topLeft = androidx.compose.ui.geometry.Offset(startX, startY),
                        size = androidx.compose.ui.geometry.Size(tierWidth, tierHeight),
                        cornerRadius = androidx.compose.ui.geometry.CornerRadius(0f),
                        style = Stroke(width = 2.dp.toPx())
                    )
                } else if (shape == "heart") {
                    drawCircle(
                        color = Color.Red,
                        radius = 4.dp.toPx(),
                        center = androidx.compose.ui.geometry.Offset(centerX, startY + tierHeight / 2)
                    )
                }

                // Decorative frosting ribbons
                drawRoundRect(
                    color = Color.White,
                    topLeft = androidx.compose.ui.geometry.Offset(startX, startY - 2.dp.toPx()),
                    size = androidx.compose.ui.geometry.Size(tierWidth, 5.dp.toPx()),
                    cornerRadius = androidx.compose.ui.geometry.CornerRadius(2.dp.toPx())
                )

                if (toppings.contains("ganache_drips")) {
                    for (d in 0..6) {
                        val dripX = startX + (tierWidth / 6) * d
                        drawCircle(
                            color = Color(0xFF3B2314),
                            radius = 3.dp.toPx(),
                            center = androidx.compose.ui.geometry.Offset(dripX, startY + 6.dp.toPx())
                        )
                    }
                }

                if (toppings.contains("sprinkles")) {
                    drawCircle(color = Color.Yellow, radius = 2.dp.toPx(), center = androidx.compose.ui.geometry.Offset(startX + 12.dp.toPx(), startY + 8.dp.toPx()))
                    drawCircle(color = Color.Cyan, radius = 2.dp.toPx(), center = androidx.compose.ui.geometry.Offset(startX + tierWidth - 16.dp.toPx(), startY + 14.dp.toPx()))
                    drawCircle(color = Color.Magenta, radius = 2.dp.toPx(), center = androidx.compose.ui.geometry.Offset(centerX - 24.dp.toPx(), startY + 10.dp.toPx()))
                }
            }

            // Topmost tier elements
            val topWidth = 140.dp.toPx() * (1.0f - ((tiers - 1) * 0.22f))
            val topY = (canvasHeight - 38.dp.toPx()) - (tiers * singleTierHeight)

            if (toppings.contains("cherries")) {
                drawCircle(color = Color(0xFFD62728), radius = 6.dp.toPx(), center = androidx.compose.ui.geometry.Offset(centerX, topY - 6.dp.toPx()))
                drawLine(color = Color(0xFF4B5320), start = androidx.compose.ui.geometry.Offset(centerX, topY - 12.dp.toPx()), end = androidx.compose.ui.geometry.Offset(centerX + 8.dp.toPx(), topY - 20.dp.toPx()), strokeWidth = 2f)
            }

            if (toppings.contains("strawberries")) {
                drawCircle(color = Color(0xFFE41B1F), radius = 7.dp.toPx(), center = androidx.compose.ui.geometry.Offset(centerX - 14.dp.toPx(), topY - 6.dp.toPx()))
                drawCircle(color = Color(0xFFE41B1F), radius = 7.dp.toPx(), center = androidx.compose.ui.geometry.Offset(centerX + 14.dp.toPx(), topY - 6.dp.toPx()))
            }

            if (toppings.contains("gold_foil")) {
                drawCircle(color = Color(0xFFFFD700), radius = 4.dp.toPx(), center = androidx.compose.ui.geometry.Offset(centerX - 40.dp.toPx(), topY + 4.dp.toPx()))
                drawCircle(color = Color(0xFFFFD700), radius = 3.dp.toPx(), center = androidx.compose.ui.geometry.Offset(centerX + 35.dp.toPx(), topY + 12.dp.toPx()))
            }

            if (toppings.contains("pearls")) {
                for (p in 0..4) {
                    val pearlX = (centerX - topWidth/2) + (topWidth / 4) * p
                    drawCircle(color = Color(0xFFF1F5F9), radius = 3.dp.toPx(), center = androidx.compose.ui.geometry.Offset(pearlX, topY))
                }
            }

            if (toppings.contains("macarons")) {
                drawRoundRect(color = Color(0xFFC4B5FD), topLeft = androidx.compose.ui.geometry.Offset(centerX - 24.dp.toPx(), topY - 6.dp.toPx()), size = androidx.compose.ui.geometry.Size(16.dp.toPx(), 7.dp.toPx()), cornerRadius = androidx.compose.ui.geometry.CornerRadius(3.dp.toPx()))
                drawRoundRect(color = Color(0xFFF472B6), topLeft = androidx.compose.ui.geometry.Offset(centerX + 8.dp.toPx(), topY - 6.dp.toPx()), size = androidx.compose.ui.geometry.Size(16.dp.toPx(), 7.dp.toPx()), cornerRadius = androidx.compose.ui.geometry.CornerRadius(3.dp.toPx()))
            }
        }
    }
}
