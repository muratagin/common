import { Requests } from "@app/api";
import Icon from "@components/icon";
import Loading from "@libs/loading";
import { getEntityUrl } from "@libs/parser";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Index() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsForOffer();
  }, []);

  const getProductsForOffer = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/GetProductsForOffer`,
        },
      });

      setLoading(true);
      const response = await Requests().CommonRequest.get({
        url,
      });

      if (response && response.data) {
        setProducts(response.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      {loading && <Loading />}
      <div className="page-container bg-transparent">
        <div className="flex flex-col gap-y-2 p-4 lg:p-0 flex-shrink-0">
          <h5 className="font-bold text-xl text-primary">Sigorta Çeşitleri</h5>
          <span className="font-normal text-matter-horn">
            Teklif almak için ilgilendiğiniz sigorta kategorisine tıklayarak
            size özel sigorta tekliflerine ulaşabilirsiniz.
          </span>
        </div>
        <div className="flex gap-x-5 flex-wrap mt-10 justify-center lg:justify-normal">
          {products &&
            products.length > 0 &&
            products.map((product, index) => (
              <Link
                to={`/offer/create/${product.ProductId}`}
                key={index}
                state={{ productType: product.ProductType }}
                className="flex justify-center flex-col items-center gap-y-2.5 group"
              >
                <div className="rounded-xl shadow-md bg-white flex justify-center items-center w-64 h-40">
                  <img
                    src="/company-logo.svg"
                    className="object-contain w-44 group-hover:w-48 transition-all duration-300"
                  />
                </div>
                <div className="flex justify-center items-center gap-x-2 h-10">
                  <span className="font-semibold text-base">
                    {product.ProductName}
                  </span>
                  <div className="rounded-full w-0 h-0 group-hover:w-7 group-hover:h-7 bg-success invisible group-hover:visible flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Icon icon="FaCheck" className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Index;
