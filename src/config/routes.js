const ROUTES = [
  { path: "/gallery", name: "Gallery" },
  { path: "/detail/:id", name: "Detail" },
  { path: "/for-sale", name: "For Sale" },
  { path: "/my-nfts", name: "My NFTs", auth: true },
  { path: "/my-offers", name: "My Offers", auth: true },
  { path: "/code", name: "Generation Code" },
  { path: "/faq", name: "FAQ" },
  { path: "/", name: "Home" },
];

export default ROUTES;
