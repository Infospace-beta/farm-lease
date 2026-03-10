"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

// ────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────

const KENYA_AREAS = [
  // ── Broad regions ──────────────────────────────────────────
  "Rift Valley", "Central Kenya", "Coastal Region", "Eastern Kenya",
  "Western Kenya", "Nyanza", "North Eastern",

  // ── 47 Counties ────────────────────────────────────────────
  "Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi",
  "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga",
  "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans-Nzoia",
  "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru",
  "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma",
  "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira",

  // ── Nairobi sub-counties / areas ───────────────────────────
  "Westlands", "Dagoretti North", "Dagoretti South", "Langata", "Kibra",
  "Roysambu", "Kasarani", "Ruaraka", "Embakasi South", "Embakasi North",
  "Embakasi Central", "Embakasi East", "Embakasi West", "Makadara",
  "Kamukunji", "Starehe", "Mathare", "Pumwani", "Karen", "Kilimani",
  "Parklands", "Kawangware", "Nairobi CBD", "Gigiri", "Runda", "Muthaiga",
  "Eastleigh", "South B", "South C", "Ngara", "Buruburu", "Donholm",
  "Umoja", "Kayole", "Komarock", "Tassia", "Mihango", "Utawala",
  "Ruai", "Njiru", "Githurai", "Kahawa", "Zimmerman", "Korogocho",
  "Pipeline", "Soweto", "Mathare North", "Huruma", "Mwiki", "Regen",

  // ── Mombasa sub-counties ───────────────────────────────────
  "Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita",
  "Bamburi", "Mtwapa", "Shanzu", "Mikindani", "Port Reitz", "Tudor",

  // ── Kwale sub-counties & towns ─────────────────────────────
  "Msambweni", "Lungamawe", "Matuga", "Kinango",
  "Ukunda", "Diani", "Shimba Hills", "Gazi",

  // ── Kilifi sub-counties & towns ────────────────────────────
  "Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze",
  "Malindi", "Magarini", "Watamu", "Mambrui", "Mariakani",

  // ── Tana River sub-counties ────────────────────────────────
  "Garsen", "Galole", "Bura",

  // ── Lamu sub-counties ──────────────────────────────────────
  "Lamu East", "Lamu West",

  // ── Taita-Taveta sub-counties & towns ──────────────────────
  "Taveta", "Wundanyi", "Mwatate", "Voi",

  // ── Garissa sub-counties ───────────────────────────────────
  "Garissa Township", "Hulugho", "Dadaab", "Balambala", "Lagdera", "Ijara",

  // ── Wajir sub-counties ─────────────────────────────────────
  "Wajir North", "Wajir East", "Wajir South", "Wajir West", "Tarbaj", "Eldas",

  // ── Mandera sub-counties ───────────────────────────────────
  "Mandera East", "Mandera West", "Mandera North", "Mandera South",
  "Lafey", "Banissa",

  // ── Marsabit sub-counties ──────────────────────────────────
  "Moyale", "North Horr", "Saku", "Laisamis",

  // ── Isiolo sub-counties ────────────────────────────────────
  "Isiolo North", "Isiolo South", "Merti", "Garbatulla",

  // ── Meru sub-counties & towns ──────────────────────────────
  "Igembe South", "Igembe Central", "Igembe North",
  "Tigania West", "Tigania East",
  "Central Imenti", "North Imenti", "South Imenti", "Buuri",
  "Meru Town", "Nkubu", "Maua", "Mikinduri",

  // ── Tharaka-Nithi sub-counties ─────────────────────────────
  "Maara", "Chuka", "Tharaka North", "Tharaka South", "Igambangobe",

  // ── Embu sub-counties & towns ──────────────────────────────
  "Mbeere North", "Mbeere South", "Manyatta", "Runyenjes", "Embu Town",

  // ── Kitui sub-counties & towns ─────────────────────────────
  "Mwingi North", "Mwingi West", "Mwingi Central", "Kitui West",
  "Kitui Rural", "Kitui Central", "Kitui East", "Kitui South",
  "Kitui Town", "Mwingi Town",

  // ── Machakos sub-counties & towns ─────────────────────────
  "Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani",
  "Mavoko", "Machakos Town", "Mwala", "Athi River", "Mlolongo",
  "Tala", "Wote",

  // ── Makueni sub-counties ───────────────────────────────────
  "Makueni", "Kibwezi East", "Kibwezi West", "Kilome", "Kaiti", "Mbooni",
  "Makueni Town", "Sultan Hamud",

  // ── Nyandarua sub-counties & towns ────────────────────────
  "Kinangop", "Kipipiri", "Ol Kalou", "Ndaragwa", "Ol Jorok",

  // ── Nyeri sub-counties & towns ─────────────────────────────
  "Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town",
  "Karatina",

  // ── Kirinyaga sub-counties & towns ────────────────────────
  "Mwea", "Gichugu", "Ndia", "Kirinyaga Central", "Kerugoya", "Kutus",

  // ── Murang'a sub-counties & towns ─────────────────────────
  "Kangema", "Mathioya", "Kigumo", "Kiharu", "Kandara", "Gatanga",
  "Murang'a South", "Kahuro", "Murang'a Town",

  // ── Kiambu sub-counties & towns ────────────────────────────
  "Gatundu South", "Gatundu North", "Juja", "Thika Town", "Ruiru",
  "Githunguri", "Kiambu Town", "Kiambaa", "Kabete", "Kikuyu",
  "Limuru", "Lari", "Tigoni", "Banana", "Karuri",

  // ── Turkana sub-counties ───────────────────────────────────
  "Turkana North", "Turkana West", "Turkana Central", "Turkana East",
  "Turkana South", "Loima", "Lodwar",

  // ── West Pokot sub-counties ────────────────────────────────
  "Pokot South", "Pokot North", "Pokot Central", "Kacheliba",
  "Kapenguria", "Alale",

  // ── Samburu sub-counties ───────────────────────────────────
  "Samburu North", "Samburu East", "Samburu West", "Maralal",

  // ── Trans-Nzoia sub-counties & towns ──────────────────────
  "Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany", "Kitale",

  // ── Uasin Gishu sub-counties & towns ──────────────────────
  "Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses", "Eldoret",
  "Burnt Forest", "Ziwa",

  // ── Elgeyo-Marakwet sub-counties ──────────────────────────
  "Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South",
  "Iten", "Chesoi",

  // ── Nandi sub-counties & towns ─────────────────────────────
  "Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop",

  // ── Baringo sub-counties & towns ──────────────────────────
  "Tiaty", "Baringo North", "Baringo Central", "Baringo South",
  "Eldama Ravine", "Mogotio", "Kabarnet",

  // ── Laikipia sub-counties & towns ─────────────────────────
  "Laikipia West", "Laikipia East", "Laikipia North",
  "Nanyuki", "Nyahururu", "Dol Dol",

  // ── Nakuru sub-counties & towns ────────────────────────────
  "Molo", "Njoro", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North",
  "Subukia", "Rongai", "Bahati", "Nakuru Town East", "Nakuru Town West",
  "Naivasha Town", "Narok Road",

  // ── Narok sub-counties & towns ─────────────────────────────
  "Kilgoris", "Emurua Dikirr", "Narok North", "Narok South",
  "Narok East", "Narok West", "Narok Town",

  // ── Kajiado sub-counties & towns ──────────────────────────
  "Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West",
  "Kajiado South", "Isinya", "Kiserian", "Ngong", "Kitengela",
  "Kajiado Town", "Namanga", "Loitokitok",

  // ── Kericho sub-counties & towns ──────────────────────────
  "Kipkelion East", "Kipkelion West", "Ainamoi", "Bureti", "Belgut",
  "Sigowet", "Soin", "Kericho Town",

  // ── Bomet sub-counties & towns ─────────────────────────────
  "Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin",
  "Bomet Town",

  // ── Kakamega sub-counties & towns ─────────────────────────
  "Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo",
  "Mumias West", "Mumias East", "Matungu", "Butere", "Khwisero",
  "Shinyalu", "Ikolomani", "Kakamega Town", "Mumias",

  // ── Vihiga sub-counties & towns ────────────────────────────
  "Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya",

  // ── Bungoma sub-counties & towns ──────────────────────────
  "Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi",
  "Webuye East", "Webuye West", "Kimilili", "Tongaren", "Webuye", "Bungoma Town",

  // ── Busia sub-counties & towns ─────────────────────────────
  "Teso North", "Teso South", "Nambale", "Matayos", "Butula",
  "Funyula", "Budalangi", "Busia Town",

  // ── Siaya sub-counties & towns ─────────────────────────────
  "Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda",
  "Siaya Town",

  // ── Kisumu sub-counties & towns ────────────────────────────
  "Kisumu East", "Kisumu West", "Kisumu Central", "Seme",
  "Nyando", "Muhoroni", "Nyakach", "Kisumu Town", "Awasi",

  // ── Homa Bay sub-counties & towns ─────────────────────────
  "Kasipul", "Kabondo Kasipul", "Karachuonyo", "Rangwe",
  "Homa Bay Town", "Ndhiwa", "Mbita", "Suba",

  // ── Migori sub-counties & towns ────────────────────────────
  "Rongo", "Awendo", "Suna East", "Suna West", "Uriri",
  "Nyatike", "Kuria West", "Kuria East", "Migori Town", "Isebania",

  // ── Kisii sub-counties & towns ─────────────────────────────
  "Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi",
  "Bomachoge Chache", "Nyaribari Masaba", "Nyaribari Chache",
  "Kitutu Chache North", "Kitutu Chache South", "West Mugirango",
  "North Mugirango", "Kisii Town", "Suneka",

  // ── Nyamira sub-counties & towns ──────────────────────────
  "Kitutu Masaba", "Nyamira South", "Nyamira North", "Borabu",
  "Nyamira Town",
];

const CROP_KEYWORDS = [
  // ── Cereals ─────────────────────────────────────────────────
  "Maize", "Wheat", "Rice", "Sorghum", "Finger Millet", "Pearl Millet",
  "Barley", "Oats", "Teff",
  // ── Legumes ─────────────────────────────────────────────────
  "Beans", "Soya Bean", "Pigeon Pea", "Cowpea", "Groundnuts", "Green Gram",
  "Lentils", "Chickpea", "Dolichos Bean", "Garden Pea",
  // ── Root & Tuber Crops ───────────────────────────────────────
  "Cassava", "Sweet Potato", "Irish Potato", "Arrowroot", "Yam",
  // ── Horticulture – Vegetables ────────────────────────────────
  "Tomato", "Cabbage", "Kale", "Spinach", "Onion", "Carrot", "Capsicum",
  "Broccoli", "Cauliflower", "Lettuce", "Cucumber", "Courgette", "Pumpkin",
  "Chilli", "Garlic", "Leek", "Beetroot", "Celery",
  // ── Horticulture – Fruits ────────────────────────────────────
  "Avocado", "Mango", "Banana", "Pineapple", "Passion Fruit", "Watermelon",
  "Pawpaw", "Strawberry", "Orange", "Lemon", "Tangerine", "Guava",
  "Macadamia", "Peach", "Plum", "Grape", "Coconut", "Cashew",
  // ── Export / Industrial Crops ────────────────────────────────
  "Tea", "Coffee", "Pyrethrum", "Sunflower", "Cotton", "Tobacco", "Sisal",
  "Sugarcane", "Miraa", "Safflower", "Sesame",
  // ── General ──────────────────────────────────────────────────
  "Horticulture", "Floriculture", "Mixed Farming",
];

const FEATURE_KEYWORDS = [
  // ── Soil Types ───────────────────────────────────────────────
  "Loam", "Sandy Loam", "Clay", "Sandy", "Volcanic", "Red Clay",
  "Black Cotton", "Alluvial", "Silt", "Silty Loam", "Laterite",
  "Murram", "Peaty", "Humus-rich",
  // ── Soil Quality ─────────────────────────────────────────────
  "Fertile", "Well-drained", "Poorly Drained", "High Nitrogen",
  "Acidic Soil", "Neutral pH", "Alkaline Soil", "Organic", "Certified Organic",
  // ── Water Sources ────────────────────────────────────────────
  "River", "Borehole", "Rain-fed", "Piped", "Dam", "Irrigation",
  "Stream", "Lake-fed", "Spring", "Drip Irrigation", "Sprinkler",
  "Gravity Fed",
  // ── Terrain ──────────────────────────────────────────────────
  "Flat", "Hilly", "Gentle Slope", "Steep", "Terraced", "Valley",
  "Plateau", "Undulating", "Flood Plain",
  // ── Infrastructure & Access ──────────────────────────────────
  "Fenced", "Electrified", "Road Access", "Tarmac Access", "Murram Road",
  "Near Market", "Title Deed", "Certified",
  // ── Elevation ───────────────────────────────────────────────
  "Highland", "Lowland", "Midland", "Semi-arid", "Arid", "Semi-humid",
  "Cool Climate", "Hot Climate",
];

const REGION_CROPS: Record<string, string[]> = {
  // ── Broad regions ────────────────────────────────────────────
  "Rift Valley": ["Maize", "Wheat", "Barley", "Pyrethrum", "Sunflower", "Beans"],
  "Central Kenya": ["Tea", "Coffee", "Avocado", "Macadamia", "Horticulture", "Irish Potato"],
  "Coastal Region": ["Coconut", "Cassava", "Mango", "Cashew", "Sugarcane", "Tomato"],
  "Eastern Kenya": ["Mango", "Pigeon Pea", "Sorghum", "Cotton", "Green Gram", "Groundnuts"],
  "Western Kenya": ["Sugarcane", "Maize", "Soya Bean", "Sunflower", "Beans", "Groundnuts"],
  "Nyanza": ["Rice", "Maize", "Sorghum", "Sweet Potato", "Sugarcane"],
  "North Eastern": ["Sorghum", "Cowpea", "Pigeon Pea", "Finger Millet"],
  // ── Counties ─────────────────────────────────────────────────
  "Nakuru": ["Maize", "Wheat", "Pyrethrum", "Avocado", "Barley", "Irish Potato"],
  "Narok": ["Maize", "Wheat", "Barley", "Sunflower"],
  "Nyeri": ["Coffee", "Tea", "Avocado", "Macadamia", "Horticulture"],
  "Meru": ["Tea", "Coffee", "Miraa", "Beans", "Irish Potato", "Beetroot"],
  "Kiambu": ["Tea", "Coffee", "Horticulture", "Avocado", "Macadamia"],
  "Kisumu": ["Rice", "Maize", "Sorghum", "Sugarcane", "Sweet Potato"],
  "Uasin Gishu": ["Maize", "Wheat", "Sunflower", "Barley", "Beans"],
  "Trans-Nzoia": ["Maize", "Wheat", "Beans", "Sunflower", "Soya Bean"],
  "Nandi": ["Tea", "Maize", "Pyrethrum", "Beans"],
  "Kericho": ["Tea", "Maize", "Pyrethrum", "Passion Fruit"],
  "Bomet": ["Tea", "Maize", "Pyrethrum", "Sorghum"],
  "Murang'a": ["Coffee", "Tea", "Avocado", "Banana", "Macadamia"],
  "Kirinyaga": ["Rice", "Tea", "Coffee", "Avocado", "Horticulture"],
  "Embu": ["Coffee", "Tea", "Avocado", "Macadamia", "Beans"],
  "Tharaka-Nithi": ["Miraa", "Coffee", "Pigeon Pea", "Sorghum"],
  "Kitui": ["Cotton", "Pigeon Pea", "Green Gram", "Sorghum"],
  "Machakos": ["Green Gram", "Pigeon Pea", "Mango", "Tomato", "Maize"],
  "Makueni": ["Green Gram", "Cotton", "Mango", "Pigeon Pea"],
  "Kajiado": ["Maize", "Wheat", "Horticulture", "Beans"],
  "Kakamega": ["Sugarcane", "Maize", "Soya Bean", "Beans", "Groundnuts"],
  "Bungoma": ["Sugarcane", "Maize", "Wheat", "Soya Bean"],
  "Busia": ["Sugarcane", "Maize", "Rice", "Sweet Potato"],
  "Siaya": ["Maize", "Sorghum", "Finger Millet", "Sweet Potato"],
  "Homa Bay": ["Maize", "Sorghum", "Sweet Potato", "Rice"],
  "Migori": ["Maize", "Sorghum", "Sugarcane", "Rice"],
  "Kisii": ["Tea", "Maize", "Banana", "Coffee", "Avocado"],
  "Nyamira": ["Tea", "Maize", "Pyrethrum", "Avocado"],
  "Kwale": ["Coconut", "Cashew", "Cassava", "Sugarcane"],
  "Kilifi": ["Coconut", "Cassava", "Mango", "Cashew", "Tomato"],
  "Mombasa": ["Horticulture", "Coconut"],
  "Laikipia": ["Maize", "Wheat", "Barley", "Horticulture"],
  "Nyandarua": ["Irish Potato", "Wheat", "Pyrethrum", "Cabbage", "Carrot"],
  "Elgeyo-Marakwet": ["Maize", "Wheat", "Sunflower", "Sorghum"],
  "Baringo": ["Maize", "Sorghum", "Beans", "Mango"],
  "Turkana": ["Sorghum", "Cowpea", "Pigeon Pea"],
  "Samburu": ["Sorghum", "Cowpea"],
  "West Pokot": ["Sorghum", "Maize", "Beans", "Finger Millet"],
  "Isiolo": ["Sorghum", "Cowpea", "Green Gram"],
  "Marsabit": ["Sorghum", "Cowpea"],
  "Wajir": ["Sorghum", "Cowpea", "Pigeon Pea"],
  "Mandera": ["Sorghum", "Cowpea", "Green Gram"],
  "Garissa": ["Sorghum", "Green Gram", "Cowpea"],
  "Taita-Taveta": ["Mango", "Cassava", "Maize", "Cotton"],
  "Tana River": ["Rice", "Maize", "Cassava", "Cotton"],
  "Lamu": ["Coconut", "Mango", "Cassava"],
  "Vihiga": ["Tea", "Maize", "Beans", "Banana"],
};

type Listing = {
  id?: number;
  name: string;
  acresNum: number;
  location: string;
  region: string;
  price: string;
  soil: string;
  water: string;
  slope: string;
  badge: string;
  badgeColor: string;
  match: string | null;
  matchColor: string;
  status: string | null;
  photoUrl?: string;
  photoUrls: string[];
};

// ── Map a verified API land to the Listing display shape ──────
const BADGE_COLORS = [
  "bg-[#047857]", "bg-amber-600", "bg-teal-600",
  "bg-purple-600", "bg-orange-600", "bg-amber-700", "bg-blue-600",
];
const KNOWN_REGIONS = [
  "Rift Valley", "Central Kenya", "Coastal Region", "Eastern Kenya",
  "Western Kenya", "Nyanza", "North Eastern", "Nairobi", "Mombasa",
  "Nakuru", "Kiambu", "Uasin Gishu", "Narok", "Nyeri", "Meru", "Kisumu",
  "Kakamega", "Kilifi", "Machakos", "Laikipia", "Trans-Nzoia", "Kericho",
  "Bomet", "Kisii", "Nyamira", "Bungoma", "Busia", "Siaya", "Homa Bay",
  "Migori", "Murang'a", "Kirinyaga", "Embu", "Kitui", "Makueni", "Nyandarua",
  "Kajiado", "Turkana", "Vihiga", "Tharaka-Nithi", "Baringo", "Nandi",
  "Elgeyo-Marakwet", "Samburu", "West Pokot", "Isiolo", "Marsabit",
  "Mandera", "Wajir", "Garissa", "Tana River", "Lamu", "Taita-Taveta", "Kwale",
];
type ApiLand = {
  id: number;
  title: string;
  total_area: string | number;
  price_per_month: string | number;
  location_name: string;
  has_irrigation: boolean;
  description?: string;
  soil_data?: { soil_type?: string } | null;
  images?: { id: number; image: string }[];
};
function mapApiToListing(l: ApiLand): Listing {
  const loc = l.location_name || "Kenya";
  let region = "Kenya";
  for (const r of KNOWN_REGIONS) {
    if (loc.toLowerCase().includes(r.toLowerCase())) { region = r; break; }
  }
  const soil = l.soil_data?.soil_type || "Not specified";
  const water = l.has_irrigation ? "Irrigation" : "Rain-fed";
  const priceNum = Math.floor(Number(l.price_per_month));
  const price = isNaN(priceNum) ? "—" : priceNum.toLocaleString();
  let badge = "Available";
  const desc = (l.description || "").toLowerCase();
  const cropHints: [string, string][] = [
    ["maize", "Maize"], ["wheat", "Wheat"], ["tea", "Tea"], ["coffee", "Coffee"],
    ["avocado", "Avocado"], ["sugarcane", "Sugarcane"], ["rice", "Rice"],
    ["horticulture", "Horticulture"], ["cassava", "Cassava"], ["coconut", "Coconut"],
  ];
  for (const [kw, label] of cropHints) { if (desc.includes(kw)) { badge = label; break; } }
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const photoUrls = (l.images ?? []).map((img) => {
    const raw = img.image;
    return raw.startsWith("http") ? raw : `${BASE}${raw}`;
  });
  const photoUrl = photoUrls[0];
  return {
    id: l.id, name: l.title, acresNum: Number(l.total_area),
    location: loc, region, price, soil, water, slope: "Flat",
    badge, badgeColor: BADGE_COLORS[l.id % BADGE_COLORS.length],
    match: null, matchColor: "", status: null,
    photoUrl,
    photoUrls,
  };
}

const ALL_LISTINGS: Listing[] = []; // populated from API at runtime

// Build suggestion pool from listings + static keyword lists
function buildSuggestions(listings: Listing[]): string[] {
  const pool = new Set<string>([
    ...KENYA_AREAS,
    ...CROP_KEYWORDS,
    ...FEATURE_KEYWORDS,
    ...listings.map((l) => l.name),
    ...listings.map((l) => l.location),
    ...listings.map((l) => l.soil),
    ...listings.map((l) => l.water),
    ...listings.map((l) => l.badge),
  ]);
  return Array.from(pool).sort();
}

const STATIC_SUGGESTIONS = buildSuggestions([]);

export default function BrowseLandPage() {
  const router = useRouter();

  // ── Listing detail modal ───────────────────────────────────
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // ── Wishlist — persisted to localStorage ─────────────────────
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const stored = JSON.parse(localStorage.getItem("fl_wishlist") ?? "{}") as Record<string, unknown>;
      return new Set(Object.keys(stored));
    } catch { return new Set<string>(); }
  });

  // ── API listings ──────────────────────────────────────────
  const [apiListings, setApiListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);

  useEffect(() => {
    lesseeApi
      .listings()
      .then((res) => {
        const mapped = (res.data as ApiLand[]).map(mapApiToListing);
        setApiListings(mapped);
      })
      .catch(() => setListingsError("Could not load listings. Please try again."))
      .finally(() => setListingsLoading(false));
  }, []);

  const allSuggestions = useMemo(
    () => buildSuggestions(apiListings),
    [apiListings]
  );

  function toggleWishlist(listing: Listing) {
    setWishlist((prev) => {
      const next = new Set(prev);
      const wasIn = next.has(listing.name);
      wasIn ? next.delete(listing.name) : next.add(listing.name);
      try {
        const stored = JSON.parse(localStorage.getItem("fl_wishlist") ?? "{}") as Record<string, Listing>;
        if (wasIn) delete stored[listing.name]; else stored[listing.name] = listing;
        localStorage.setItem("fl_wishlist", JSON.stringify(stored));
      } catch { /* ignore */ }
      return next;
    });
  }

  // ── Header search ──────────────────────────────────────────
  const [headerSearch, setHeaderSearch] = useState("");
  const [showHeaderSugg, setShowHeaderSugg] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const headerSuggestions = useMemo(() => {
    if (!headerSearch.trim()) return [];
    const q = headerSearch.toLowerCase();
    return allSuggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerSearch, allSuggestions]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node))
        setShowHeaderSugg(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Mobile filter sidebar toggle ─────────────────────────
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Sort state ─────────────────────────────────────────────
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "price_desc" | "acres_asc" | "acres_desc" | "newest">("recommended");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const SORT_OPTIONS: { value: typeof sortBy; label: string; icon: string }[] = [
    { value: "recommended", label: "Recommended", icon: "auto_awesome" },
    { value: "price_asc", label: "Price: Low to High", icon: "arrow_upward" },
    { value: "price_desc", label: "Price: High to Low", icon: "arrow_downward" },
    { value: "acres_asc", label: "Acreage: Smallest First", icon: "straighten" },
    { value: "acres_desc", label: "Acreage: Largest First", icon: "straighten" },
    { value: "newest", label: "Newest First", icon: "schedule" },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setShowSortMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Filter panel state ─────────────────────────────────────
  const [minAcres, setMinAcres] = useState(0);
  const [maxAcres, setMaxAcres] = useState(500);
  const [soilType, setSoilType] = useState("Any Soil Type");
  const [waterSource, setWaterSource] = useState("Any Water Source");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);

  // Region searchable multi-select
  const [regionQuery, setRegionQuery] = useState("");
  const [showRegionSugg, setShowRegionSugg] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const regionRef = useRef<HTMLDivElement>(null);

  const regionSuggestions = useMemo(() => {
    if (!regionQuery.trim()) return KENYA_AREAS.slice(0, 8);
    const q = regionQuery.toLowerCase();
    return KENYA_AREAS.filter((a) => a.toLowerCase().includes(q)).slice(0, 8);
  }, [regionQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node))
        setShowRegionSugg(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addRegion(region: string) {
    if (!selectedRegions.includes(region))
      setSelectedRegions((prev) => [...prev, region]);
    setRegionQuery("");
    setShowRegionSugg(false);
  }

  function removeRegion(region: string) {
    setSelectedRegions((prev) => prev.filter((r) => r !== region));
  }

  // AI crops derived from selected regions
  const aiCrops = useMemo(() => {
    const set = new Set<string>();
    selectedRegions.forEach((r) => {
      (REGION_CROPS[r] ?? []).forEach((c) => set.add(c));
    });
    if (set.size === 0) ["Maize", "Wheat", "Avocado"].forEach((c) => set.add(c));
    return Array.from(set).slice(0, 5);
  }, [selectedRegions]);

  function resetFilters() {
    setMinAcres(0);
    setMaxAcres(500);
    setSoilType("Any Soil Type");
    setWaterSource("Any Water Source");
    setMinPrice(0);
    setMaxPrice(10000000);
    setSelectedRegions([]);
    setRegionQuery("");
    setHeaderSearch("");
    setSortBy("recommended");
  }

  // ── Filtered + sorted listings ──────────────────────────────
  const filteredListings = useMemo(() => {
    const filtered = apiListings.filter((l) => {
      // Real-time keyword search
      if (headerSearch.trim()) {
        const q = headerSearch.toLowerCase();
        const haystack = [l.name, l.location, l.soil, l.water, l.slope, l.badge, l.region]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Region filter
      if (selectedRegions.length > 0) {
        const ok = selectedRegions.some(
          (r) =>
            l.region.toLowerCase().includes(r.toLowerCase()) ||
            l.location.toLowerCase().includes(r.toLowerCase()),
        );
        if (!ok) return false;
      }
      // Acreage range
      if (l.acresNum < minAcres || l.acresNum > maxAcres) return false;
      // Soil type
      if (
        soilType !== "Any Soil Type" &&
        !l.soil.toLowerCase().includes(soilType.toLowerCase())
      )
        return false;
      // Water source
      if (
        waterSource !== "Any Water Source" &&
        !l.water.toLowerCase().includes(waterSource.toLowerCase())
      )
        return false;
      // Price range (price stored as string like "30,000" — parse numeric)
      const numericPrice = Number(l.price.replace(/,/g, ""));
      if (!isNaN(numericPrice)) {
        if (numericPrice < minPrice || numericPrice > maxPrice) return false;
      }
      return true;
    });

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "price_asc":
        sorted.sort((a, b) => Number(a.price.replace(/,/g, "")) - Number(b.price.replace(/,/g, "")));
        break;
      case "price_desc":
        sorted.sort((a, b) => Number(b.price.replace(/,/g, "")) - Number(a.price.replace(/,/g, "")));
        break;
      case "acres_asc":
        sorted.sort((a, b) => a.acresNum - b.acresNum);
        break;
      case "acres_desc":
        sorted.sort((a, b) => b.acresNum - a.acresNum);
        break;
      case "newest":
        sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        break;
      default:
        // recommended — keep original order
        break;
    }
    return sorted;
  }, [headerSearch, selectedRegions, minAcres, maxAcres, soilType, waterSource, minPrice, maxPrice, apiListings, sortBy]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <LesseePageHeader
        title="Browse Land"
        subtitle="Browse available leasing opportunities matched to your preferences"
      >
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilters((v) => !v)}
          className="flex lg:hidden items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium shadow-sm"
        >
          <span className="material-icons-round text-base">tune</span>
          Filters
        </button>
        {/* Header search with live suggestions */}
        <div ref={headerRef} className="relative w-40 sm:w-64 lg:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-xl">
            search
          </span>
          <input
            type="text"
            value={headerSearch}
            onChange={(e) => {
              setHeaderSearch(e.target.value);
              setShowHeaderSugg(true);
            }}
            onFocus={() => setShowHeaderSugg(true)}
            placeholder="Search location or keyword..."
            className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] text-gray-700 placeholder-gray-400"
          />
          {headerSearch && (
            <button
              onClick={() => { setHeaderSearch(""); setShowHeaderSugg(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          )}
          {showHeaderSugg && headerSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {headerSuggestions.map((s) => (
                <li key={s}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setHeaderSearch(s); setShowHeaderSugg(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#047857] transition flex items-center gap-2"
                  >
                    <span className="material-icons-round text-gray-400 text-base">search</span>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {headerSearch && (
          <button
            onClick={() => { setHeaderSearch(""); setShowHeaderSugg(false); }}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
        )}
      </LesseePageHeader>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        {/* ── Left Filters Panel ──────────────────────────── */}
        <aside className={`
          ${showMobileFilters ? "flex" : "hidden lg:flex"}
          w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200
          overflow-y-auto p-4 sm:p-6 flex-col gap-6 flex-shrink-0
          max-h-[70vh] lg:max-h-full
        `}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3
                className="font-bold text-gray-800 flex items-center gap-2 text-xl"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="material-icons-round text-[#047857] text-2xl">tune</span>
                Farm Preferences
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#047857] hover:text-emerald-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons-round text-xl">close</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Adjust these settings to filter the land listings automatically.
            </p>
          </div>

          {/* ── Preferred Regions — searchable autocomplete ── */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block mb-2">
              Preferred Regions
            </label>

            {/* Selected region chips */}
            {selectedRegions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedRegions.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-[#047857] text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {r}
                    <button onClick={() => removeRegion(r)} className="text-[#047857] hover:text-emerald-800 ml-0.5">
                      <span className="material-icons-round text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Region search input */}
            <div ref={regionRef} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-base">
                location_on
              </span>
              <input
                type="text"
                value={regionQuery}
                onChange={(e) => { setRegionQuery(e.target.value); setShowRegionSugg(true); }}
                onFocus={() => setShowRegionSugg(true)}
                placeholder="Search area in Kenya..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] bg-gray-50"
              />
              {showRegionSugg && regionSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {regionSuggestions.map((r) => (
                    <li key={r}>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addRegion(r)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 hover:text-[#047857] transition flex items-center gap-2 ${selectedRegions.includes(r) ? "text-[#047857] font-semibold" : "text-gray-700"
                          }`}
                      >
                        <span className="material-icons-round text-gray-400 text-sm">location_on</span>
                        {r}
                        {selectedRegions.includes(r) && (
                          <span className="material-icons-round text-[#047857] text-sm ml-auto">check</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── AI Recommended Crops ──────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
                AI Recommended Crops
              </label>
              <span className="flex items-center text-[10px] text-[#5D4037] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="material-icons-round text-[14px] mr-1 text-amber-600">auto_awesome</span>
                Gemini AI
              </span>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl p-4 border-2 border-emerald-200">
              {selectedRegions.length > 0 ? (
                <>
                  <p className="text-[10px] text-[#0f392b] font-medium mb-2.5">
                    Based on soil data &amp; climate history for{" "}
                    <span className="font-bold text-[#047857]">
                      {selectedRegions.slice(0, 2).join(" & ")}
                      {selectedRegions.length > 2 ? ` +${selectedRegions.length - 2}` : ""}
                    </span>
                    :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiCrops.map((crop) => (
                      <div
                        key={crop}
                        className="inline-flex items-center bg-[#0f392b] text-emerald-100 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
                      >
                        <span className="material-icons-round text-[13px] mr-1.5 text-[#13ec80]">auto_awesome</span>
                        {crop}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[10px] text-[#0f392b] font-medium text-center py-2">
                  Select a region above to see AI crop recommendations.
                </p>
              )}
            </div>
          </div>

          {/* ── Target Acreage ───────────────────────────── */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
              Target Acreage
            </label>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-gray-500 font-medium">Min (Acres)</span>
                <input
                  type="number"
                  min="0"
                  max={maxAcres - 1}
                  value={minAcres}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(Number(e.target.value), maxAcres - 1));
                    setMinAcres(isNaN(v) ? 0 : v);
                  }}
                  className="w-20 text-right text-[11px] font-bold text-[#047857] border border-[#047857]/30 rounded px-1.5 py-0.5 bg-white focus:outline-none focus:border-[#047857]"
                />
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={minAcres}
                onChange={(e) => setMinAcres(Math.min(Number(e.target.value), maxAcres - 1))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #047857 0%, #047857 ${(minAcres / 500) * 100}%, #e5e7eb ${(minAcres / 500) * 100}%, #e5e7eb 100%)`,
                  accentColor: "#047857",
                }}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-gray-500 font-medium">Max (Acres)</span>
                <input
                  type="number"
                  min={minAcres + 1}
                  max="500"
                  value={maxAcres}
                  onChange={(e) => {
                    const v = Math.min(500, Math.max(Number(e.target.value), minAcres + 1));
                    setMaxAcres(isNaN(v) ? 500 : v);
                  }}
                  className="w-20 text-right text-[11px] font-bold text-[#047857] border border-[#047857]/30 rounded px-1.5 py-0.5 bg-white focus:outline-none focus:border-[#047857]"
                />
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={maxAcres}
                onChange={(e) => setMaxAcres(Math.max(Number(e.target.value), minAcres + 1))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #047857 0%, #047857 ${(maxAcres / 500) * 100}%, #e5e7eb ${(maxAcres / 500) * 100}%, #e5e7eb 100%)`,
                  accentColor: "#047857",
                }}
              />
            </div>
          </div>

          {/* ── Soil Type ────────────────────────────────── */}
          <div className="space-y-3 mb-2">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
              Soil Type Preference
            </label>
            <div className="relative">
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-[#047857] cursor-pointer"
              >
                <option>Any Soil Type</option>
                <option>Loam</option>
                <option>Volcanic</option>
                <option>Clay</option>
                <option>Red Clay</option>
                <option>Sandy</option>
                <option>Black Cotton</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 material-icons-round text-xl">
                expand_more
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowMobileFilters(false)}
            className="mt-auto w-full bg-[#047857] hover:bg-emerald-800 text-white font-medium py-3 rounded-xl shadow-lg transition-colors"
          >
            View Results
          </button>
        </aside>

        {/* ── Main Listings ──────────────────────────────────── */}
        <div className="flex-1 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3
              className="text-lg sm:text-xl font-bold text-gray-800"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {listingsLoading ? "Loading listings…" : `${filteredListings.length} Land Listing${filteredListings.length !== 1 ? "s" : ""} Found`}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#047857] hover:text-[#047857] transition-all"
                >
                  <span className="material-icons-round text-base">
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.icon ?? "sort"}
                  </span>
                  <span className="hidden sm:inline">{SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort"}</span>
                  <span className="material-icons-round text-lg">expand_more</span>
                </button>
                {showSortMenu && (
                  <ul className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-emerald-50 hover:text-[#047857] transition ${sortBy === opt.value ? "text-[#047857] font-semibold bg-emerald-50" : "text-gray-700"
                            }`}
                        >
                          <span className="material-icons-round text-base">{opt.icon}</span>
                          {opt.label}
                          {sortBy === opt.value && (
                            <span className="material-icons-round text-sm ml-auto">check</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {
            listingsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-9 bg-gray-200 rounded-xl mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listingsError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="material-icons-round text-6xl text-red-200 mb-4">error_outline</span>
                <p className="text-lg font-bold text-gray-500">{listingsError}</p>
                <button
                  onClick={() => {
                    setListingsLoading(true);
                    setListingsError(null);
                    lesseeApi
                      .listings()
                      .then((res) => setApiListings((res.data as ApiLand[]).map(mapApiToListing)))
                      .catch(() => setListingsError("Could not load listings. Please try again."))
                      .finally(() => setListingsLoading(false));
                  }}
                  className="mt-5 px-6 py-2.5 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition"
                >
                  Retry
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="material-icons-round text-6xl text-gray-200 mb-4">landscape</span>
                <p className="text-lg font-bold text-gray-400">No verified listings match your filters</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search, regions, or acreage range.</p>
                <button
                  onClick={resetFilters}
                  className="mt-5 px-6 py-2.5 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.name}
                    className="bg-white rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#047857]/20 flex flex-col"
                  >
                    <div className="relative h-48 bg-gray-200">
                      {listing.photoUrl ? (
                        <img
                          src={listing.photoUrl}
                          alt={listing.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                          <span className="material-icons-round text-[#0f392b]/20 text-[80px]">landscape</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent">
                        <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800">
                          {listing.acresNum} Acres
                        </span>
                      </div>
                      <span
                        className={`absolute bottom-3 left-3 ${listing.badgeColor} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm`}
                      >
                        {listing.badge}
                      </span>
                      {/* Wishlist heart — top-right of image, no background */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(listing); }}
                        className="absolute top-3 right-3 p-1.5 rounded-full transition-all"
                        title={wishlist.has(listing.name) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <span className={`material-icons-round text-base ${wishlist.has(listing.name) ? "text-red-400" : "text-white"
                          }`}>
                          {wishlist.has(listing.name) ? "favorite" : "favorite_border"}
                        </span>
                      </button>
                    </div>

                    <div className="pt-4 px-5 pb-5 flex flex-col flex-1">
                      <h4
                        className="font-bold text-lg text-gray-900 mb-1"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {listing.name}
                      </h4>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="material-icons-round text-sm mr-1">location_on</span>
                          {listing.location}
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <div className="text-sm font-bold text-[#047857] whitespace-nowrap">
                            Ksh {listing.price}
                            <span className="text-[10px] font-normal text-gray-400">/acre/yr</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-4">
                        <div className="text-center">
                          <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">Soil</div>
                          <div className="text-xs font-medium text-gray-600">{listing.soil}</div>
                        </div>
                        <div className="text-center border-l border-r border-gray-100">
                          <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">Water</div>
                          <div className="text-xs font-medium text-gray-600 truncate">{listing.water}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">Slope</div>
                          <div className="text-xs font-medium text-gray-600">{listing.slope}</div>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {listing.match ? (
                              <>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${listing.matchColor}`}>
                                  <span className="text-[10px] font-bold">{listing.match}</span>
                                </div>
                                <span className="text-[10px] text-gray-400">Match</span>
                              </>
                            ) : (
                              <span className="text-xs text-orange-500 font-medium">{listing.status}</span>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedListing(listing)}
                            className="text-xs font-bold text-[#047857] flex items-center hover:text-emerald-700 transition-colors"
                          >
                            View Details
                            <span className="material-icons-round text-sm ml-1">arrow_forward</span>
                          </button>
                        </div>
                        <button
                          onClick={() => router.push(`/lessee/leases/new?landId=${listing.id}`)}
                          className="w-full bg-[#047857] hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-sm"
                        >
                          Request Lease
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div >
      </div >
      {/* ── Listing Detail Modal ──────────────────────────────── */}
      {
        selectedListing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedListing(null)}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image area */}
              <div className="relative h-52 bg-gray-200 rounded-t-2xl overflow-hidden">
                {selectedListing.photoUrl ? (
                  <img
                    src={selectedListing.photoUrl}
                    alt={selectedListing.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                    <span className="material-icons-round text-[#0f392b]/20 text-[100px]">landscape</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                {/* Acres badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-gray-800 shadow">
                    {selectedListing.acresNum} Acres
                  </span>
                </div>
                {/* Favourite */}
                <button className="absolute top-4 right-4 p-2 rounded-full text-white transition-colors hover:text-red-400">
                  <span className="material-icons-round text-xl">favorite_border</span>
                </button>
                {/* Crop badge */}
                <span className={`absolute bottom-4 left-4 ${selectedListing.badgeColor} text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow`}>
                  {selectedListing.badge}
                </span>
                {/* Close button */}
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-4 right-16 p-2 rounded-full text-white transition-colors hover:text-gray-300"
                >
                  <span className="material-icons-round text-xl">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Name + price row */}
                <div className="flex items-start justify-between mb-1">
                  <h2
                    className="text-2xl font-bold text-gray-900 leading-tight"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {selectedListing.name}
                  </h2>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Lease Price</div>
                    <div className="text-lg font-bold text-[#047857] whitespace-nowrap">
                      Ksh {selectedListing.price}
                      <span className="text-xs font-normal text-gray-400">/acre/yr</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-500 mb-5">
                  <span className="material-icons-round text-base mr-1 text-[#047857]">location_on</span>
                  {selectedListing.location}
                </div>

                {/* Soil / Water / Slope stats */}
                <div className="grid grid-cols-3 gap-3 py-4 px-4 bg-[#f8fafc] rounded-xl mb-5">
                  <div className="text-center">
                    <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide mb-1">Soil</div>
                    <div className="text-sm font-semibold text-gray-700">{selectedListing.soil}</div>
                  </div>
                  <div className="text-center border-l border-r border-gray-200">
                    <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide mb-1">Water</div>
                    <div className="text-sm font-semibold text-gray-700">{selectedListing.water}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide mb-1">Slope</div>
                    <div className="text-sm font-semibold text-gray-700">{selectedListing.slope}</div>
                  </div>
                </div>

                {/* Match score */}
                {selectedListing.match && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${selectedListing.matchColor}`}>
                      {selectedListing.match}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#047857]">Compatibility Match</p>
                      <p className="text-xs text-gray-500">Based on your stated farm preferences and selected regions.</p>
                    </div>
                  </div>
                )}
                {selectedListing.status && (
                  <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl mb-5">
                    <span className="material-icons-round text-orange-400 text-xl">hourglass_top</span>
                    <p className="text-sm font-medium text-orange-700">{selectedListing.status}</p>
                  </div>
                )}

                {/* AI Crops for region */}
                {(REGION_CROPS[selectedListing.region] ?? []).length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="material-icons-round text-amber-500 text-sm">auto_awesome</span>
                      AI Recommended Crops for {selectedListing.region}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(REGION_CROPS[selectedListing.region] ?? []).slice(0, 6).map((crop) => (
                        <span key={crop} className="inline-flex items-center bg-[#0f392b] text-emerald-100 px-3 py-1 rounded-full text-xs font-medium">
                          <span className="material-icons-round text-[11px] mr-1 text-[#13ec80]">auto_awesome</span>
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => router.push(`/lessee/leases/new?landId=${selectedListing.id}`)}
                    className="flex-1 bg-[#047857] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow transition-colors text-sm"
                  >
                    Request Lease
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedListing)}
                    className={`flex-1 border-2 font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-1.5 ${wishlist.has(selectedListing.name)
                      ? "bg-[#047857] border-[#047857] text-white shadow"
                      : "border-[#047857] text-[#047857] hover:bg-emerald-50"
                      }`}
                  >
                    <span className="material-icons-round text-base">
                      {wishlist.has(selectedListing.name) ? "favorite" : "favorite_border"}
                    </span>
                    {wishlist.has(selectedListing.name) ? "Wishlisted" : "Save to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
