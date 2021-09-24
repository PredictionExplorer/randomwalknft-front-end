const ROUTES = [
  { path: "/gallery", name: "Gallery" },
  { path: "/detail/:id", name: "Detail" },
  { path: "/my-nfts", name: "My NFTs", auth: true },
  { path: "/rarity", name: "Rarity" },
  { path: "/faq", name: "FAQ" },
  { path: "/", name: "Home" },
];

export default ROUTES;
