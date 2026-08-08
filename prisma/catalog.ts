/**
 * The seed catalogue for Sweet Crust — shared by `prisma/seed.ts` (which
 * writes it to the database) and `scripts/fetch-photos.ts` (which downloads a
 * placeholder photo per `slug`).
 *
 * ⚠️ PLACEHOLDER CONTENT. Names, copy and prices are realistic for a Kigali
 * patisserie but are NOT the client's real menu. Prices are RWF, whole francs.
 */

export type SeedVariant = { name: string; priceRwf: number };

export type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  priceRwf: number;
  unit: string;
  allergens: string;
  leadTimeHours?: number;
  isFeatured?: boolean;
  isSoldOut?: boolean;
  variants?: SeedVariant[];
  /** Search term used to fetch the placeholder photo. */
  photoQuery: string;
};

export type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  photoQuery: string;
  products: SeedProduct[];
};

/** Standard round-cake sizes, priced off the product's base (6 inch) price. */
function cakeSizes(base: number): SeedVariant[] {
  return [
    { name: '6 inch — serves 8', priceRwf: base },
    { name: '8 inch — serves 14', priceRwf: Math.round(base * 1.55) },
    { name: '10 inch — serves 24', priceRwf: Math.round(base * 2.3) },
  ];
}

export const CATALOG: SeedCategory[] = [
  {
    slug: 'breads',
    name: 'Breads',
    description:
      'Slow-fermented loaves, baguettes and rolls, pulled from the oven every morning before six.',
    photoQuery: 'artisan bread loaves bakery',
    products: [
      {
        slug: 'white-sandwich-loaf',
        name: 'White Sandwich Loaf',
        description: 'Soft, milky crumb with a thin golden crust — the everyday loaf.',
        longDescription:
          'Our house white loaf is mixed the night before and given a long, cool rise so the crumb stays tender for days. Sliced thick it makes the best French toast in Kigali; sliced thin it is the quiet backbone of a school lunchbox.',
        priceRwf: 2000,
        unit: 'per loaf',
        allergens: 'Gluten,Dairy',
        isFeatured: true,
        photoQuery: 'white sandwich bread loaf sliced',
      },
      {
        slug: 'whole-wheat-loaf',
        name: 'Whole Wheat Loaf',
        description: 'Stoneground wholemeal flour, a little honey, and nothing else.',
        longDescription:
          'Made with stoneground wholemeal flour and sweetened with a spoon of local honey. Dense enough to hold a proper filling, soft enough that the children will still eat it.',
        priceRwf: 2500,
        unit: 'per loaf',
        allergens: 'Gluten',
        photoQuery: 'wholemeal bread',
      },
      {
        slug: 'french-baguette',
        name: 'French Baguette',
        description: 'Crackling crust, open crumb, baked three times a day.',
        longDescription:
          'Four ingredients and eighteen hours. We bake baguettes at six, at noon and again at four so there is always one still warm on the rack. Best eaten the same day — that is not a limitation, it is the point.',
        priceRwf: 1500,
        unit: 'each',
        allergens: 'Gluten',
        isFeatured: true,
        photoQuery: 'baguette bread basket',
      },
      {
        slug: 'sourdough-boule',
        name: 'Sourdough Boule',
        description: 'A 36-hour rise on our own starter, blistered and deeply sour.',
        longDescription:
          'Our starter has been fed daily since the bakery opened. This round boule ferments for thirty-six hours, which is what gives it the blistered crust, the custardy crumb and that clean sour finish. Keeps beautifully for four days in a paper bag.',
        priceRwf: 4000,
        unit: 'per loaf',
        allergens: 'Gluten',
        isFeatured: true,
        photoQuery: 'sourdough bread boule scored crust',
      },
      {
        slug: 'brioche-loaf',
        name: 'Brioche Loaf',
        description: 'Enriched with butter and eggs until it is very nearly cake.',
        longDescription:
          'A generous amount of butter and egg worked into the dough over two days, producing a golden, feather-light crumb that pulls apart in ribbons. Toast it, or do not — it needs no help.',
        priceRwf: 3500,
        unit: 'per loaf',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'brioche buns',
      },
      {
        slug: 'milk-rolls',
        name: 'Soft Milk Rolls',
        description: 'Pillowy dinner rolls with a glossy, buttered top.',
        longDescription:
          'Six pull-apart rolls baked together in one tin so their sides stay soft. Brushed with butter the moment they leave the oven. They disappear fastest at Sunday lunch.',
        priceRwf: 2500,
        unit: 'per 6',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'bread rolls buns',
      },
      {
        slug: 'sesame-bagels',
        name: 'Sesame Bagels',
        description: 'Boiled then baked, with a proper chew and a sesame crust.',
        longDescription:
          'Boiled in barley-malt water before baking, which is the only way to get the glassy crust and dense chew a bagel is supposed to have. Rolled generously in toasted sesame.',
        priceRwf: 3000,
        unit: 'per 4',
        allergens: 'Gluten,Sesame',
        photoQuery: 'sesame bagels bread',
      },
      {
        slug: 'rosemary-focaccia',
        name: 'Rosemary Focaccia',
        description: 'Dimpled, olive-oil rich, scattered with rosemary and flaked salt.',
        longDescription:
          'A whole tray of high-hydration dough, dimpled by hand and flooded with good olive oil before it goes in. Rosemary and flaked salt on top. Cut into squares, it is the easiest thing to put in front of guests.',
        priceRwf: 4500,
        unit: 'per tray',
        allergens: 'Gluten',
        photoQuery: 'rosemary focaccia bread tray',
      },
      {
        slug: 'dark-rye-loaf',
        name: 'Dark Rye Loaf',
        description: 'Malted rye, molasses and caraway — dense, dark and long-keeping.',
        longDescription:
          'Heavy with malted rye and darkened with molasses, finished with caraway. This is a keeping loaf: it improves on day two and is still excellent on day five. Cut it thin.',
        priceRwf: 3500,
        unit: 'per loaf',
        allergens: 'Gluten',
        photoQuery: 'dark rye bread loaf',
      },
      {
        slug: 'ciabatta',
        name: 'Ciabatta',
        description: 'Wildly open crumb, floury crust, built for olive oil.',
        longDescription:
          'A very wet dough handled as little as possible, which is what opens the crumb into those large irregular holes. Split and grilled it makes the sandwich; torn and dipped it makes the meal.',
        priceRwf: 2000,
        unit: 'per 2',
        allergens: 'Gluten',
        photoQuery: 'ciabatta bread',
      },
      {
        slug: 'honey-oat-loaf',
        name: 'Honey & Oat Loaf',
        description: 'Soft oat crumb, honey through the dough, oats across the top.',
        longDescription:
          'Rolled oats soaked overnight go into the dough, which keeps the crumb soft and faintly sweet without any sugar beyond the honey. A good breakfast loaf.',
        priceRwf: 3000,
        unit: 'per loaf',
        allergens: 'Gluten,Dairy',
        photoQuery: 'oatmeal bread',
      },
      {
        slug: 'banana-bread',
        name: 'Banana Bread',
        description: 'Very ripe bananas, brown butter, a crackled sugar top.',
        longDescription:
          'We wait for the bananas to go properly black before they go anywhere near the mixer, and we brown the butter first. The top is finished with demerara so it crackles under the knife.',
        priceRwf: 3500,
        unit: 'per loaf',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'banana bread loaf sliced',
      },
    ],
  },
  {
    slug: 'cakes',
    name: 'Cakes',
    description:
      'Celebration cakes, cheesecakes and mousses — made to order, decorated by hand.',
    photoQuery: 'decorated layer cake bakery',
    products: [
      {
        slug: 'chocolate-fudge-cake',
        name: 'Chocolate Fudge Cake',
        description: 'Three dark layers under a thick blanket of fudge ganache.',
        longDescription:
          'Three layers of deep, damp chocolate sponge, each one soaked and stacked with a fudge ganache made from 70% chocolate. Finished in a thick swoop of the same ganache. This is the cake people come back for.',
        priceRwf: 22000,
        unit: '6 inch round',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 24,
        isFeatured: true,
        variants: cakeSizes(22000),
        photoQuery: 'chocolate layer cake ganache slice',
      },
      {
        slug: 'vanilla-celebration-cake',
        name: 'Vanilla Celebration Cake',
        description: 'Madagascan vanilla sponge with silky buttercream.',
        longDescription:
          'A light, even-crumbed sponge scented with real Madagascan vanilla, layered with a Swiss meringue buttercream that is silky rather than sweet. The blank canvas for any celebration — tell us what to write on it.',
        priceRwf: 20000,
        unit: '6 inch round',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 24,
        variants: cakeSizes(20000),
        photoQuery: 'frosted layer cake',
      },
      {
        slug: 'red-velvet-cake',
        name: 'Red Velvet Cake',
        description: 'Deep crimson crumb with tangy cream cheese frosting.',
        longDescription:
          'A proper red velvet: buttermilk and a whisper of cocoa for that soft, faintly tangy crumb, under a cream cheese frosting sharp enough to cut the sweetness. Finished with velvet crumbs around the sides.',
        priceRwf: 25000,
        unit: '6 inch round',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 24,
        isFeatured: true,
        variants: cakeSizes(25000),
        photoQuery: 'red velvet cake',
      },
      {
        slug: 'new-york-cheesecake',
        name: 'New York Cheesecake',
        description: 'Baked low and slow on a buttery biscuit base.',
        longDescription:
          'Baked in a water bath at a low temperature for two hours, then rested overnight, which is what gives it that dense, unbroken, faintly caramelised top. On a thick buttered biscuit base.',
        priceRwf: 28000,
        unit: '8 inch round',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 24,
        photoQuery: 'cheesecake',
      },
      {
        slug: 'black-forest-cake',
        name: 'Black Forest Cake',
        description: 'Cherries, kirsch cream and dark chocolate shavings.',
        longDescription:
          'Chocolate sponge soaked in kirsch, layered with morello cherries and lightly sweetened cream, buried under dark chocolate shavings. An old cake, done properly.',
        priceRwf: 27000,
        unit: '8 inch round',
        allergens: 'Gluten,Dairy,Eggs,Alcohol',
        leadTimeHours: 24,
        variants: cakeSizes(27000),
        photoQuery: 'black forest cake cherries cream',
      },
      {
        slug: 'carrot-walnut-cake',
        name: 'Carrot & Walnut Cake',
        description: 'Spiced, damp and generous, under cream cheese frosting.',
        longDescription:
          'Heavy with grated carrot, walnuts, cinnamon and nutmeg, which keeps it damp for days. Cream cheese frosting, and a scatter of toasted walnuts on top.',
        priceRwf: 24000,
        unit: '8 inch round',
        allergens: 'Gluten,Dairy,Eggs,Nuts',
        leadTimeHours: 24,
        photoQuery: 'carrot cake walnut cream cheese',
      },
      {
        slug: 'tropical-fruit-cake',
        name: 'Tropical Fruit Cake',
        description: 'Passion fruit, mango and pineapple over vanilla chantilly.',
        longDescription:
          'A vanilla sponge layered with chantilly and crowned with whatever the market gave us that morning — usually passion fruit, mango and pineapple. Light, sharp and very much of this place.',
        priceRwf: 26000,
        unit: '8 inch round',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 24,
        isFeatured: true,
        photoQuery: 'strawberry cake',
      },
      {
        slug: 'lemon-drizzle-cake',
        name: 'Lemon Drizzle Cake',
        description: 'Soaked in lemon syrup while still warm from the oven.',
        longDescription:
          'The syrup goes on while the cake is still in the tin and still hot, so it sinks the whole way through instead of sitting on top. Crunchy sugar crust, very sharp.',
        priceRwf: 18000,
        unit: 'loaf',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 12,
        photoQuery: 'lemon cake',
      },
      {
        slug: 'chocolate-mousse-cake',
        name: 'Chocolate Mousse Cake',
        description: 'Aerated dark mousse on a thin flourless base, mirror-glazed.',
        longDescription:
          'A thin flourless chocolate base carrying a very light 70% mousse, set overnight and finished with a dark mirror glaze. Serve it cold and cut it with a hot knife.',
        priceRwf: 30000,
        unit: '8 inch round',
        allergens: 'Dairy,Eggs',
        leadTimeHours: 48,
        photoQuery: 'chocolate mousse cake mirror glaze',
      },
      {
        slug: 'tiramisu',
        name: 'Tiramisu',
        description: 'Espresso-soaked savoiardi under mascarpone cream and cocoa.',
        longDescription:
          'Savoiardi soaked in proper espresso, layered with a mascarpone cream lightened with whipped egg white, dusted heavily with cocoa just before it leaves the kitchen.',
        priceRwf: 26000,
        unit: 'family tray',
        allergens: 'Gluten,Dairy,Eggs,Alcohol',
        leadTimeHours: 24,
        photoQuery: 'tiramisu',
      },
      {
        slug: 'passion-fruit-mousse-cake',
        name: 'Passion Fruit Mousse Cake',
        description: 'Sharp passion fruit mousse over an almond dacquoise.',
        longDescription:
          'An almond dacquoise base under a passion fruit mousse that is deliberately sharp, finished with a clear passion fruit jelly and a few seeds. The most refreshing thing in the counter.',
        priceRwf: 29000,
        unit: '8 inch round',
        allergens: 'Dairy,Eggs,Nuts',
        leadTimeHours: 48,
        photoQuery: 'passion fruit mousse cake dessert',
      },
      {
        slug: 'birthday-cake',
        name: 'Birthday Cake',
        description: 'Your flavour, your colours, your message piped by hand.',
        longDescription:
          'Choose the sponge and the buttercream colour, tell us the name and the age, and we will pipe it by hand. Sprinkles included whether you asked for them or not. Two days notice, please.',
        priceRwf: 24000,
        unit: '6 inch round',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 48,
        variants: cakeSizes(24000),
        photoQuery: 'birthday cake sprinkles candles',
      },
      {
        slug: 'wedding-cake',
        name: 'Wedding Cake',
        description: 'Tiered, hand-finished, tasted with you before the day.',
        longDescription:
          'Tiered wedding cakes finished by hand in the style you bring us. The price below is a starting point for three tiers — we will quote properly once we have talked. Every couple gets a tasting before the deposit.',
        priceRwf: 180000,
        unit: '3 tiers',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 336,
        variants: [
          { name: '2 tiers — serves 40', priceRwf: 130000 },
          { name: '3 tiers — serves 80', priceRwf: 180000 },
          { name: '4 tiers — serves 140', priceRwf: 260000 },
        ],
        photoQuery: 'white tiered wedding cake flowers',
      },
      {
        slug: 'vanilla-cupcakes',
        name: 'Vanilla Cupcakes',
        description: 'Six vanilla cupcakes under swirled buttercream.',
        longDescription:
          'A box of six, swirled high with vanilla buttercream and finished with whatever sprinkle suits the occasion. Say the word and we will colour them to match your party.',
        priceRwf: 9000,
        unit: 'box of 6',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 12,
        photoQuery: 'vanilla cupcakes buttercream swirl',
      },
      {
        slug: 'red-velvet-cupcakes',
        name: 'Red Velvet Cupcakes',
        description: 'Six crimson cupcakes with cream cheese frosting.',
        longDescription:
          'The red velvet cake in miniature — same buttermilk crumb, same sharp cream cheese frosting, six to a box. The most-ordered thing we make for office birthdays.',
        priceRwf: 10000,
        unit: 'box of 6',
        allergens: 'Gluten,Dairy,Eggs',
        leadTimeHours: 12,
        photoQuery: 'red velvet cupcake',
      },
      {
        slug: 'marble-pound-cake',
        name: 'Marble Pound Cake',
        description: 'Vanilla and cocoa batter folded once, never twice.',
        longDescription:
          'Vanilla and cocoa batters folded together exactly once, so the marbling stays bold instead of muddying into brown. A dense, buttery pound cake that travels well.',
        priceRwf: 16000,
        unit: 'loaf',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'marble cake slice',
      },
    ],
  },
  {
    slug: 'pastries',
    name: 'Pastries',
    description:
      'Laminated viennoiserie, tarts and choux — the counter is fullest at seven in the morning.',
    photoQuery: 'pastry display counter bakery',
    products: [
      {
        slug: 'butter-croissant',
        name: 'Butter Croissant',
        description: 'Twenty-seven layers, shattering crust, honeycomb inside.',
        longDescription:
          'Laminated over three days with nothing but good butter. Twenty-seven layers, a crust that shatters down your shirt and a honeycomb interior. If you buy one thing from us, buy this.',
        priceRwf: 1500,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        isFeatured: true,
        photoQuery: 'croissants',
      },
      {
        slug: 'pain-au-chocolat',
        name: 'Pain au Chocolat',
        description: 'The same laminated dough, wrapped around two dark batons.',
        longDescription:
          'Our croissant dough folded around two batons of 55% dark chocolate, which soften but never quite melt away. Best within an hour of the bake, and we will tell you honestly when that was.',
        priceRwf: 1800,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'pain au chocolat pastry',
      },
      {
        slug: 'almond-croissant',
        name: 'Almond Croissant',
        description: 'Yesterday’s croissant, reborn with frangipane and flaked almonds.',
        longDescription:
          'The honest French answer to a day-old croissant: split it, soak it in syrup, fill it with frangipane, cover it in flaked almonds and bake it again. Better than the original, and we will not pretend otherwise.',
        priceRwf: 2000,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs,Nuts',
        isFeatured: true,
        photoQuery: 'almond croissant flaked almonds',
      },
      {
        slug: 'strawberry-danish',
        name: 'Strawberry Danish',
        description: 'Vanilla custard and fresh strawberries in laminated pastry.',
        longDescription:
          'A pinwheel of laminated dough holding a spoon of vanilla crème pâtissière and fresh strawberries, glazed while warm.',
        priceRwf: 2000,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'danish pastry icing',
      },
      {
        slug: 'apple-turnover',
        name: 'Apple Turnover',
        description: 'Cinnamon apples folded into puff pastry, sugar-crusted.',
        longDescription:
          'Apples cooked down with cinnamon and a little lemon until they hold their shape, folded into puff pastry and baked until the sugar on top turns to glass.',
        priceRwf: 1800,
        unit: 'each',
        allergens: 'Gluten,Dairy',
        photoQuery: 'apple turnover puff pastry',
      },
      {
        slug: 'cinnamon-roll',
        name: 'Cinnamon Roll',
        description: 'Soft coils, dark cinnamon butter, cream cheese glaze.',
        longDescription:
          'An enriched dough rolled around dark brown sugar and cinnamon butter, baked close together so the middles stay soft, then flooded with cream cheese glaze while hot.',
        priceRwf: 1800,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        isFeatured: true,
        photoQuery: 'cinnamon roll icing',
      },
      {
        slug: 'custard-tart',
        name: 'Portuguese Custard Tart',
        description: 'Blistered, caramelised top over shattering pastry.',
        longDescription:
          'Baked in a very hot oven until the custard blisters and blackens in patches — which is the point, not a mistake. Shattering laminated pastry underneath. Eat it warm.',
        priceRwf: 2200,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'portuguese custard tart pastel de nata',
      },
      {
        slug: 'lemon-tart',
        name: 'Lemon Tart',
        description: 'Sharp lemon curd in a thin sweet pastry shell.',
        longDescription:
          'A very thin, very crisp sweet pastry shell holding a lemon curd that is deliberately more sour than sweet. Torched meringue on request.',
        priceRwf: 2500,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'lemon tart slice pastry',
      },
      {
        slug: 'chocolate-eclair',
        name: 'Chocolate Éclair',
        description: 'Choux filled with crème pâtissière, dipped in dark fondant.',
        longDescription:
          'Choux baked until properly dry so it never goes soggy, piped full of chocolate crème pâtissière and dipped in dark fondant. Filled to order in the afternoon.',
        priceRwf: 2500,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'chocolate eclair pastry',
      },
      {
        slug: 'profiteroles',
        name: 'Profiteroles',
        description: 'Four choux buns, chantilly inside, warm chocolate over.',
        longDescription:
          'Four choux buns filled with vanilla chantilly, boxed with a pot of warm chocolate sauce to pour at the table. Assemble them at the last moment.',
        priceRwf: 3500,
        unit: 'box of 4',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'profiteroles chocolate sauce choux',
      },
      {
        slug: 'mille-feuille',
        name: 'Mille-Feuille',
        description: 'Three sheets of caramelised puff, two of vanilla cream.',
        longDescription:
          'Puff pastry baked under weight so it caramelises rather than puffs, layered twice with vanilla crème légère and finished with the traditional feathered icing. Cut it with a serrated knife.',
        priceRwf: 3000,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'mille feuille',
      },
      {
        slug: 'fruit-tartlet',
        name: 'Fresh Fruit Tartlet',
        description: 'Crème pâtissière and glazed seasonal fruit.',
        longDescription:
          'A sweet pastry shell, a thick layer of vanilla crème pâtissière and whatever fruit looked best at Kimironko market this morning, glazed to a shine.',
        priceRwf: 2800,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        photoQuery: 'fruit tart',
      },
      {
        slug: 'glazed-doughnuts',
        name: 'Glazed Doughnuts',
        description: 'Fried to order in the morning, glazed while still hot.',
        longDescription:
          'Proofed slowly, fried in the early morning and glazed while still too hot to hold. When they are gone they are gone — we do not fry twice.',
        priceRwf: 1200,
        unit: 'each',
        allergens: 'Gluten,Dairy,Eggs',
        isSoldOut: true,
        photoQuery: 'glazed donuts plate',
      },
      {
        slug: 'palmier',
        name: 'Palmier',
        description: 'Caramelised puff pastry hearts, crisp all the way through.',
        longDescription:
          'Puff pastry rolled in demerara and folded into hearts, baked until the sugar caramelises to the edge. Crisp all the way through, and they keep for a week in a tin.',
        priceRwf: 1200,
        unit: 'each',
        allergens: 'Gluten,Dairy',
        photoQuery: 'palmiers pastry',
      },
    ],
  },
];

/** Atmosphere shots for the gallery that are not tied to a single product. */
export const GALLERY_EXTRAS = [
  { slug: 'bakery-counter', caption: 'The counter, just after opening', tag: 'bakery', photoQuery: 'bread display bakery' },
  { slug: 'baker-hands-dough', caption: 'Shaping the morning batch', tag: 'bakery', photoQuery: 'baker hands kneading dough' },
  { slug: 'oven-fresh-loaves', caption: 'Straight from the deck oven', tag: 'breads', photoQuery: 'freshly baked bread loaves' },
  { slug: 'cake-decorating', caption: 'Finishing a celebration cake by hand', tag: 'cakes', photoQuery: 'cake decorating' },
  { slug: 'coffee-and-pastry', caption: 'Coffee and a croissant, most mornings', tag: 'bakery', photoQuery: 'coffee cup croissant table' },
  { slug: 'cake-table-celebration', caption: 'A table we were proud of', tag: 'cakes', photoQuery: 'celebration dessert table cakes' },
  { slug: 'bread-basket', caption: 'The daily bread basket', tag: 'breads', photoQuery: 'basket of bread loaves' },
  { slug: 'pastry-tray', caption: 'Viennoiserie, seven in the morning', tag: 'pastries', photoQuery: 'tray of croissants pastries bakery' },
];

/** Hero and section imagery. */
export const FEATURE_IMAGES = [
  { slug: 'hero-main', photoQuery: 'assorted pastries croissants cakes' },
  { slug: 'hero-story', photoQuery: 'bakery kitchen shaping dough' },
  { slug: 'custom-cake-hero', photoQuery: 'cake decorated flowers' },
];

export const ALL_PRODUCTS = CATALOG.flatMap((c) => c.products);
