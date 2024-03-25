import LoginLayout from "@components/LoginLayout";
import MainLayout from "@components/MainLayout";
import { useRoutes } from "react-router-dom";
import PrivateRoute from "./private.route";

//pages
import ApprovalLayout from "@components/ApprovalLayout";
import Asset from "@pages/asset";
import DeclarationApproval from "@pages/declaration.approval";
import EndrosementCreate from "@pages/endorsement.create";
import ForgotPassword from "@pages/forgotpassword";
import Home from "@pages/home";
import KvkkApproval from "@pages/kvkk.approval";
import Login from "@pages/login";
import Logout from "@pages/logout";
import OfferCreate from "@pages/offer.create";
import ProductSelection from "@pages/product.selection";
import Shortener from "@pages/shortener";

export default function Router() {
  const routes = [
    {
      element: <MainLayout />,
      auth: true,
      children: [
        {
          auth: true,
          path: "/offer/product-selection",
          element: <ProductSelection />,
        },
        {
          auth: true,
          path: "/offer/create/:productId",
          element: <OfferCreate />,
        },
        {
          auth: true,
          path: "/offer/edit/:offerId",
          element: <OfferCreate />,
        },
        {
          auth: true,
          path: "/endorsement/create/:offerId",
          element: <EndrosementCreate />,
        },
        { auth: true, path: "/:asset/*", element: <Asset /> },
        { auth: true, index: true, element: <Home /> },
      ],
    },
    {
      element: <ApprovalLayout />,
      children: [
        {
          path: "/sigortali-onayi/beyan-onayi/:insuredId?",
          element: <DeclarationApproval />,
        },
        {
          path: "/sigortali-onayi/kvkk-onayi/:insuredId?",
          element: <KvkkApproval />,
        },
        { path: "/shr/:guidId?", element: <Shortener /> },
      ],
    },
    { path: "logout", element: <Logout /> },
    {
      element: <LoginLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "forgotpassword", element: <ForgotPassword /> },
      ],
    },
  ];
  return useRoutes(authMap(routes));
}

const authMap = (routes) =>
  routes.map((route) => {
    if (route?.auth) {
      route.element = <PrivateRoute>{route.element}</PrivateRoute>;
    }
    if (route?.children) {
      route.children = authMap(route.children);
    }
    return route;
  });
