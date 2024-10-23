// pages/console.js
// "use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
// import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { WavRecorder, WavStreamPlayer } from "../../lib/wavtools/index.js";
import { instructions } from "../../utils/conversation_config.js";
import { WavRenderer } from "../../utils/wav_renderer";
import { X, Edit, Zap, ArrowUp, ArrowDown } from "react-feather";
import { Button } from "../../components/button/Button";
import { Toggle } from "../../components/toggle/Toggle";
import Fuse from "fuse.js";
// import { Map } from "../../components/map/Map.js";
import axios from "axios";
// import {
//   product_search,
//   get_cart,
//   remove_from_cart,
//   add_to_cart,
// } from "../";
import getProducts, {
  product_search,
  addToCart,
  createCheckout,
  removeCartLines,
  retrieveCart,
  updateCart,
} from "../../utils/voiceShopify";
import convertAudioToText from "../../components/convertorAudiotoText.js";
// import Products from "../components/Products";
// import "../components/Products.scss";
// import "./ConsolePage.scss";

const LOCAL_RELAY_SERVER_URL =
  process.env.REACT_APP_LOCAL_RELAY_SERVER_URL || "";

export default function ConsolePage() {
  const [apiKey, setApiKey] = useState("");

  // useEffect(() => {
  //   const apiKey = LOCAL_RELAY_SERVER_URL
  //     ? ""
  //     : localStorage.getItem("tmp::voice_api_key") ||
  //       prompt("OpenAI API Key") ||
  //       "";
  //   if (apiKey !== "") {
  //     setApiKey(apiKey);
  //     localStorage.setItem("tmp::voice_api_key", apiKey);
  //   }
  // }, []);
  const clientRef = useRef();
  useEffect(() => {
    const apiKeyFromStorage = LOCAL_RELAY_SERVER_URL
      ? ""
      : localStorage.getItem("tmp::voice_api_key") ||
        prompt("OpenAI API Key") ||
        "";

    if (apiKeyFromStorage !== "") {
      setApiKey(apiKeyFromStorage);
      localStorage.setItem("tmp::voice_api_key", apiKeyFromStorage);

      // Initialize clientRef after setting the apiKey
      clientRef.current = new RealtimeClient({
        apiKey: apiKeyFromStorage,
        dangerouslyAllowAPIKeyInBrowser: true,
      });
    } else {
      console.error("API Key is empty");
    }
  }, []);

  const wavRecorderRef = useRef(new WavRecorder({ sampleRate: 24000 }));
  const wavStreamPlayerRef = useRef(new WavStreamPlayer({ sampleRate: 24000 }));
  // const clientRef = useRef(
  //   new RealtimeClient(
  //     LOCAL_RELAY_SERVER_URL
  //       ? { url: LOCAL_RELAY_SERVER_URL }
  //       : {
  //           apiKey: apiKey,
  //           dangerouslyAllowAPIKeyInBrowser: true,
  //         }
  //   )
  // );
  const clientCanvasRef = useRef(null);
  const serverCanvasRef = useRef(null);
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef(null);
  const startTimeRef = useRef(new Date().toISOString());

  const [items, setItems] = useState([]);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [checkoutURL, setCheckoutURL] = useState("");
  const [memoryKv, setMemoryKv] = useState({});
  const [coords, setCoords] = useState({ lat: 37.775593, lng: -122.418137 });
  const [marker, setMarker] = useState(null);
  const [product, setProduct] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [fuse, setFuse] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [retrieveCarts, setRetriviewCart] = useState();

  useEffect(() => {
    if (typeof window != "undefined") {
      const storedCartId = window.localStorage.getItem("cartID");
      if (storedCartId) {
        setCartId(storedCartId);
      }
    }
  }, []);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // const data = await getProducts();
        let products = await getProducts().then((data) => data);
        console.log(products, "products");
        const results = await product_search("shoes");
        console.log(results, "search data");
        const itemId = results[0].product_variant_id;
        const quantity = 1;
        const addtocart = await addToCart(itemId, quantity).then(
          (res) => res.cartCreate.cart.id
        );
        console.log(addtocart, "added to cart");
        if (addtocart) {
          const cartdata = await retrieveCart(addtocart);
          console.log(cartdata, "cart data");
        } else {
          console.log("cartId is null");
        }
        // const itemIds = results[1].product_varient_id;
        // const quantitys = 1;
        // const updateCarts = await updateCart(addtocart, itemIds, quantitys);
        // console.log(updateCarts, "updateCarts");
        // const cartdata = await retrieveCart(addtocart);
        // console.log(cartdata, "cart data");
        // const cartLength = cartdata.productDetails;
        // const datass = [];
        // for (let i = 0; i < cartLength.length; i++) {
        //   const lineIdss = cartdata.productDetails[i].productVarientId;
        //   datass.push(lineIdss); // Push each line item ID into datass
        // }
        // console.log(datass, " array");
        // //  data.push(...datass);
        // const createCheckouts = await createCheckout(datass);
        // console.log(createCheckouts, "finallyyy");
        // console.log(cartId, 'productData');
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();
  }, [cartId]);

  const formatTime = useCallback((timestamp) => {
    const startTime = startTimeRef.current;
    const t0 = new Date(startTime).valueOf();
    const t1 = new Date(timestamp).valueOf();
    const delta = t1 - t0;
    const hs = Math.floor(delta / 10) % 100;
    const s = Math.floor(delta / 1000) % 60;
    const m = Math.floor(delta / 60_000) % 60;
    const pad = (n) => {
      let s = n + "";
      while (s.length < 2) {
        s = "0" + s;
      }
      return s;
    };
    return `${pad(m)}:${pad(s)}.${pad(hs)}`;
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    if (client) {
      // console.log("Registered tools: ", client.tools);
    }
  }, []);

  const resetAPIKey = useCallback(() => {
    const apiKey = prompt("OpenAI API Key");
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem("tmp::voice_api_key", apiKey);
      window.location.reload();
    }
  }, []);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await fetch("/api/get-products");
  //       const data = await res.json();

  //       if (res.ok) {
  //         // Initialize Fuse.js
  //         const fuseInstance = new Fuse(data.products, {
  //           keys: ["title"], // Searching by product title
  //         });
  //         setFuse(fuseInstance);
  //       } else {
  //         console.error("Error fetching products:", data.error);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);
  // const searchProducts = (query) => {
  //   if (fuse && query) {
  //     const results = fuse.search(query).map((result) => ({
  //       title: result.item.title,
  //       itemId: result.item.id,
  //       unit_price: result.item.priceRange.minVariantPrice.amount,
  //       featuredImage: result.item.featuredImage.url,
  //       product_varient_id: result.item.variants.edges[0].node.id,
  //     }));
  //     setSearchResults(results);
  //   } else {
  //     setSearchResults([]);
  //   }
  // };

  // const connectConversation = useCallback(async () => {
  //   const client = clientRef.current;
  //   const wavRecorder = wavRecorderRef.current;
  //   const wavStreamPlayer = wavStreamPlayerRef.current;

  //   startTimeRef.current = new Date().toISOString();
  //   setIsConnected(true);
  //   setRealtimeEvents([]);
  //   setItems(client.conversation.getItems());
  //   await wavRecorder.begin();
  //   await wavStreamPlayer.connect();
  //   await client.connect();
  //   client.sendUserMessageContent([
  //     {
  //       type: "input_text",
  //       text: "Hello!",
  //     },
  //   ]);
  //   if (client.getTurnDetectionType() === "server_vad") {
  //     await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  //   }
  // }, []);
  const connectConversation = useCallback(async () => {
    // console.log("Connecting with API Key:", apiKey);
    try {
      // console.log("Connecting with API Key2:", apiKey);
      const client = clientRef.current;
      // console.log(client, "connectConversation");
      const wavRecorder = wavRecorderRef.current;
      const wavStreamPlayer = wavStreamPlayerRef.current;

      startTimeRef.current = new Date().toISOString();
      setIsConnected(true);
      setRealtimeEvents([]);
      setItems(client.conversation.getItems());

      await wavRecorder.begin();
      await wavStreamPlayer.connect();
      await client.connect();

      client.sendUserMessageContent([
        {
          type: "input_text",
          text: "Hello!",
        },
      ]);

      if (client.getTurnDetectionType() === "server_vad") {
        await wavRecorder.record((data) => console.log(data.mono, "audio"));
        // await wavRecorder.record((data) => client.appendInputAudio(data.mono));
      }
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    setRealtimeEvents([]);
    setItems([]);
    setMemoryKv({});
    setCoords({ lat: 37.775593, lng: -122.418137 });
    setMarker(null);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  const deleteConversationItem = useCallback(async (id) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }
    await wavRecorder.record((data) => {
      // console.log("recording", data.momo);
      // console.log(first)
      client.appendInputAudio(data.mono);
    });
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const client = clientRef.current;

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.pause();

    client.createResponse();
  };

  // Import your audio-to-text converter function

  // const [isRecording, setIsRecording] = useState(false);

  // const startRecording = async () => {
  //   setIsRecording(true);
  //   const client = clientRef.current;
  //   const wavRecorder = wavRecorderRef.current;
  //   const wavStreamPlayer = wavStreamPlayerRef.current;
  //   const trackSampleOffset = await wavStreamPlayer.interrupt();
  //   if (trackSampleOffset?.trackId) {
  //     const { trackId, offset } = trackSampleOffset;
  //     await client.cancelResponse(trackId, offset);
  //   }
  //   await wavRecorder.record(async (data) => {
  //     console.log("recording", data.mono);
  //     const text = await convertAudioToText(data.mono); // Convert audio to text
  //     client.appendInputText(text); // Send text to OpenAI
  //   });
  // };

  // const stopRecording = async () => {
  //   setIsRecording(false);
  //   const client = clientRef.current;
  //   const wavRecorder = wavRecorderRef.current;
  //   await wavRecorder.pause();
  //   client.createResponse();
  // };

  const changeTurnEndType = async (value) => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    if (value === "none" && wavRecorder.getStatus() === "recording") {
      await wavRecorder.pause();
    }
    client.updateSession({
      turn_detection: value === "none" ? null : { type: "server_vad" },
    });
    if (value === "server_vad" && client.isConnected()) {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
    setCanPushToTalk(value === "none");
  };

  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;
      // Only scroll if height has just changed
      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll("[data-conversation-content]")
    );
    for (const el of conversationEls) {
      const conversationEl = el;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx = null;

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext("2d");
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              "#0099ff",
              10,
              0,
              8
            );
          }
        }
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext("2d");
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyzing
              ? wavStreamPlayer.getFrequencies("input")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              "#009900",
              10,
              0,
              8
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();
    return () => {
      isLoaded = false;
    };
  }, []);
  // }, [wavRecorderRef, wavStreamPlayerRef]);
  useEffect(() => {
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;
    if (client === undefined) {
      return;
    }
    client.updateSession({ instructions: instructions });
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });

    client.addTool(
      {
        name: "set_memory",
        description: "Saves important data about the user into memory.",
        parameters: {
          type: "object",
          properties: {
            key: { type: "string", description: "Memory key" },
            value: { type: "string", description: "Memory value" },
          },
          required: ["key", "value"],
        },
      },
      async ({ key, value }) => {
        setMemoryKv((memoryKv) => ({ ...memoryKv, [key]: value }));
        return { ok: true };
      }
    );
    client.addTool(
      {
        name: "product_search",
        description: "Search for products based on user query",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query for products",
            },
          },
          required: ["query"],
        },
      },
      async ({ query }) => {
        // const results = await searchProducts(query);

        const results = await product_search(query);
        setProduct(results);

        return results;
      }
    );
    client.addTool(
      {
        name: "get_cart",
        description: "Retrieves the current cart details.",
        parameters: {},
      },
      async () => {
        // return await fetch(
        //   "/api/get-cart?cartId=" + localStorage.getItem("cartID")
        // ).then((r) => r.json());
        return retrieveCart(localStorage.getItem("cartID"));
      }
    );
    // client.addTool(
    //   {
    //     name: "add_to_cart",
    //     description: "Add item to cart",
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         // item: {
    //         //   type: "object",
    //         //   description:
    //         //     "json object of product returned from product_search",
    //         // },
    //         // quantity: {
    //         //   type: "number",
    //         //   description: "Quantity",
    //         // },
    //       },
    //       required: ["item", "quantity"],
    //     },
    //   },
    //   async ({ item, quantity }) => {
    //     if (!item) {
    //       if (product) {
    //         if (product.length > 0) {
    //           item = product[0];
    //         } else {
    //           return { message: "No product to add to cart" };
    //         }
    //       } else {
    //         return { message: "no data in product" };
    //       }
    //     }
    //     const itemId = item.product_varient_id;
    //     console.log(item, "voice ----- items");
    //     console.log(itemId, "voice ----- items1");
    //     quantity = 1;
    //     // const cartsId
    //     //   'gid://Cart/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpBODFTNDdDV1Y5NzBKWVg0OVJDUTRBTQ?key=58a2989ea83aae061764539182edec3d';
    //     console.log(localStorage.getItem("cartID"));
    //     if (!localStorage.getItem("cartID")) {
    //       const cartCreatevalue = await addToCart(itemId, quantity).then(
    //         (res) => {
    //           setCartId(res.cartCreate.cart.id);
    //           localStorage.setItem("cartID", res.cartCreate.cart.id);
    //         }
    //       );
    //       // const cartCreatevalue = await fetch(
    //       //   `/api/add-to-cart?itemId=${itemId}&quantity=${quantity}`
    //       // ).then((r) => r.json());

    //       console.log(cartCreatevalue.data, "Voice ==== cartCreatevalue ");
    //       // const getCartId = cartCreatevalue.cartCreate.cart.id;
    //     } else {
    //       const updateCartValue = await updateCart(
    //         localStorage.getItem("cartID"),
    //         itemId,
    //         quantity
    //       );
    //       // const updateCartValue = await fetch(
    //       //   `/api/add-to-cart?cartId=${localStorage.getItem(
    //       //     "cartID"
    //       //   )}&itemId=${itemId}&quantity=${quantity}`
    //       // ).then((r) => r.json());
    //       console.log(updateCartValue, "Voice ==== updateCartValue");
    //     }
    //     return {
    //       message: "product added to cart",
    //     };
    //   }
    // );
    client.addTool(
      {
        name: "checkout",
        description: "Functionality was completed ,Product moved to checkout",
        parameters: {
          // type: 'object', // The parameters type should be 'object' instead of 'array'
          // properties: {
          //   itemId: { type: 'string' },
          // },
          // required: ['itemId'],
        },
      },

      async () => {
        try {
          // console.log(localStorage.getItem("cartID"), "88888888888888");
          const checkoutCartlines = []; // Define the type of checkoutCartlines as a string array
          const cartDatas = await retrieveCart(localStorage.getItem("cartID")); // Make sure cartId is defined or passed into the function
          cartDatas.productDetails.forEach((lineItem) => {
            if (lineItem.productVarientId) {
              checkoutCartlines.push(lineItem.productVarientId); // Push the matched cartLineId to checkoutCartlines
            }
          });
          // console.log(checkoutCartlines, " checkoutCartlines");
          if (checkoutCartlines.length === 0) {
            throw new Error("Item not found in cart");
          }

          const checkoutCall = await createCheckout(checkoutCartlines); // Call createCheckout with the cartLineIds
          // console.log(checkoutCall, " finally");
          setCheckoutURL(checkoutCall?.checkoutCreate?.checkout?.webUrl);
          return {
            message: "Product moved to checkout",
          };
        } catch (error) {
          console.error("Error during checkout:", error);
          return {
            message: "Error during checkout",
          };
        }
      }
    );
    client.on("realtime.event", (realtimeEvent) => {
      setRealtimeEvents((realtimeEvents) => {
        const lastEvent = realtimeEvents[realtimeEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return realtimeEvents.slice(0, -1).concat(lastEvent);
        } else {
          return realtimeEvents.concat(realtimeEvent);
        }
      });
    });
    client.on("error", (event) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on("conversation.updated", async ({ item, delta }) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      client.reset();
    };
  }, []);
  useEffect(() => {
    // console.log("addddddddd");
    if (!product) {
      return;
    }
    const client = clientRef.current;
    if (client === undefined) {
      return;
    }
    try {
      client.removeTool("add_to_cart");
    } catch (e) {
      // console.log("no tool to remove");
    }
    client.addTool(
      {
        name: "add_to_cart",
        description: "Add item to cart",
        parameters: {
          type: "object",
          properties: {
            item: {
              type: "object",
              description:
                "json object of product returned from product_search",
            },
            quantity: {
              type: "number",
              description: "Quantity",
            },
          },
          required: ["item", "quantity"],
        },
      },
      async ({ item, quantity }) => {
        if (!item) {
          if (product) {
            if (product.length > 0) {
              item = product[0];
            } else {
              return { message: "No product to add to cart" };
            }
          } else {
            return { message: "no data in product" };
          }
        }
        console.log(item, " add to cart item");
        const productId = item.product_variant_id;
        console.log(productId, " add to cart item id");

        quantity = 1;

        if (!localStorage.getItem("cartID")) {
          const cartCreatevalue = await addToCart(productId, quantity).then(
            (res) => {
              setCartId(res.cartCreate.cart.id);
              localStorage.setItem("cartID", res.cartCreate.cart.id);
            }
          );
          const retrivewCartss = await retrieveCart(
            localStorage.getItem("cartID").then((res) => setRetriviewCart(res))
          );
          // console.log(cartCreatevalue, "Voice ==== cartCreatevalue ");
          // const getCartId = cartCreatevalue.cartCreate.cart.id;
        } else {
          console.log(localStorage.getItem("cartID"), "cartId");
          const updateCartValue = await updateCart(
            localStorage.getItem("cartID"),
            productId,
            quantity
          );
          console.log(updateCartValue, "Voice ==== updateCartValue");
          const retrivewCartss = await retrieveCart(
            localStorage.getItem("cartID").then((res) => setRetriviewCart(res))
          );
        }

        return {
          message: "product added to cart",
        };
      }
    );
  }, [product]);

  return (
    <div data-component="ConsolePage">
      <div className="content-top mt-16">
        <div className="content-title">
          <img src="/logo-bars.png" alt="Logo" />
          <span>NTP VoiceShop Assistant</span>
        </div>
        <div className="content-api-key">
          {!LOCAL_RELAY_SERVER_URL && (
            <Button
              icon={Edit}
              iconPosition="end"
              buttonStyle="flush"
              label={`api key: ${apiKey.slice(0, 3)}...`}
              onClick={() => resetAPIKey()}
            />
          )}
        </div>
      </div>
      <div className="content-main">
        <div className="content-logs">
          <div className="content-block events ">
            {/* <Products /> */}
            {product && product.length > 0 ? (
              <div
                data-component="Products"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {product.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border border-gray-300 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105"
                  >
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full h-auto"
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-gray-700">Price: ${item.unit_price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-28">
                <p>No products found</p>
              </div>
            )}

            {checkoutURL ? (
              <a href={checkoutURL} style={{ width: "200px", padding: "10px" }}>
                Checkout
              </a>
            ) : null}
          </div>
          <div className="content-block conversation">
            <div className="content-block-title">Conversation</div>
            <div className="content-block-body" data-conversation-content>
              {!items.length ? "awaiting connection..." : null}
              {items.map((conversationItem, i) => (
                <div className="conversation-item" key={conversationItem.id}>
                  <div className={`speaker ${conversationItem.role || ""}`}>
                    <div>
                      {(
                        conversationItem.role || conversationItem.type
                      ).replaceAll("_", " ")}
                    </div>
                    <div
                      className="close"
                      onClick={() =>
                        deleteConversationItem(conversationItem.id)
                      }
                    >
                      <X />
                    </div>
                  </div>
                  <div className="speaker-content">
                    {/* Tool response */}
                    {conversationItem.type === "function_call_output" && (
                      <div>{conversationItem.formatted.output}</div>
                    )}
                    {/* Tool call */}
                    {!!conversationItem.formatted.tool && (
                      <div>
                        {conversationItem.formatted.tool.name}(
                        {conversationItem.formatted.tool.arguments})
                      </div>
                    )}
                    {!conversationItem.formatted.tool &&
                      conversationItem.role === "user" && (
                        <div>
                          {conversationItem.formatted.transcript ||
                            (conversationItem.formatted.audio?.length
                              ? "(awaiting transcript)"
                              : conversationItem.formatted.text ||
                                "(item sent)")}
                        </div>
                      )}
                    {!conversationItem.formatted.tool &&
                      conversationItem.role === "assistant" && (
                        <div>
                          {conversationItem.formatted.transcript ||
                            conversationItem.formatted.text ||
                            "(truncated)"}
                        </div>
                      )}
                    {conversationItem.formatted.file && (
                      <audio
                        src={conversationItem.formatted.file.url}
                        controls
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-actions">
            <Toggle
              defaultValue={false}
              labels={["manual", "vad"]}
              values={["none", "server_vad"]}
              onChange={(_, value) => changeTurnEndType(value)}
            />
            <div className="spacer" />
            {isConnected && canPushToTalk && (
              <Button
                label={isRecording ? "release to send" : "push to talk"}
                buttonStyle={isRecording ? "alert" : "regular"}
                disabled={!isConnected || !canPushToTalk}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
              />
            )}
            <div className="spacer" />
            <Button
              label={isConnected ? "disconnect" : "connect"}
              icon={isConnected ? X : Zap}
              buttonStyle={isConnected ? "regular" : "action"}
              onClick={
                isConnected ? disconnectConversation : connectConversation
              }
            />
          </div>
        </div>
        <div className="content-right">
          <div className="content-block kv">
            <div className="content-block-title">Carts</div>
            <div className="content-block-body content-kv">
              {retrieveCarts?.productDetails &&
              retrieveCarts?.productDetails.length > 0 ? (
                <ul className="product-list ">
                  {retrieveCarts?.productDetails.map((item, index) => (
                    <li key={item.id || index} className="product-item">
                      <img
                        src={item.featuredImage}
                        alt={item.productName}
                        className="product-thumbnail"
                      />
                      <div className="product-info">
                        <h4>{item.productName}</h4>
                        <p>Price: ${item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
