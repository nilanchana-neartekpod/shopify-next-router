"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { WavRecorder, WavStreamPlayer } from "../../lib/wavtools/index.js";
import { instructions } from "../../utils/conversation_config.js";
import { WavRenderer } from "../../utils/wav_renderer";
import { X, Edit, Zap, ArrowUp, ArrowDown } from "react-feather";
// import { Button } from "../../components/button/Button";
import { Button } from "../../components/button/Button.js";
import { Toggle } from "../../components/toggle/Toggle";
import { TbBasketSearch } from "react-icons/tb";
import { FaMicrophone } from "react-icons/fa";
import { Codesandbox, Mic, ShoppingCart, Framer } from "react-feather";
import { CircularProgress } from "@mui/material";
// import { LiaConnectdevelop } from "react-icons/lia";
import React from "react";

import getProducts, {
  product_search,
  addToCart,
  createCheckout,
  removeCartLines,
  retrieveCart,
  updateCart,
} from "../../utils/voiceShopify";
import { searchProducts } from "../../utils/shopify.js";

const LOCAL_RELAY_SERVER_URL =
  process.env.REACT_APP_LOCAL_RELAY_SERVER_URL || "";

export default function ConsolePage() {
  const [apiKey, setApiKey] = useState("");

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

  const clientCanvasRef = useRef(null);
  const serverCanvasRef = useRef(null);
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef(null);
  const startTimeRef = useRef(new Date().toISOString());
  const timerRef = useRef(null);

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
  const [retrieveCarts, setRetriviewCart] = useState();
  const [inactivityTimer, setInactivityTimer] = useState(null); // Timer for inactivity
  const connectionTimeoutRef = useRef(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [buttonDisible, setButtonDisible] = useState(false);
  const [waitMsg, setWaitMsg] = useState(false);
  const [conversation, setConversation] = useState(false);
  useEffect(() => {
    if (typeof window != "undefined") {
      const storedCartId = window.localStorage.getItem("cartID");
      if (storedCartId) {
        setCartId(storedCartId);
      }
    }
  }, []);

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
      console.log("Registered tools: ", client.tools);
    }
  }, []);
  useEffect(() => {
    const fetchPro = async () => {
      const searchpro = await product_search("high");
      console.log(searchpro, "searchpro");
    };
    fetchPro();
  }, []);

  const resetAPIKey = useCallback(() => {
    const apiKey = prompt("OpenAI API Key");
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem("tmp::voice_api_key", apiKey);
      window.location.reload();
    }
  }, []);
  const viewCon = () => {
    setConversation(true);
  };
  const closeCon = () => {
    setConversation(false);
  };

  const connectConversation = async () => {
    try {
      setButtonDisible(true);
      setWaitMsg(true);
      const client = clientRef.current;
      const wavRecorder = wavRecorderRef.current;
      const wavStreamPlayer = wavStreamPlayerRef.current;

      startTimeRef.current = new Date().toISOString();
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
        await wavRecorder.record((data) => client.appendInputAudio(data.mono));
      }
      setWaitMsg(false);
      setIsConnected(true);
      resetInactivityTimer();
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
    }
  };

  // useEffect(() => {
  //   const searchCheck = async () => {
  //     try {
  //       // Ensure that Fuse.js has been initialized
  //       await initializeFuse(); // Ensure initialization happens before search

  //       // Now you can search for products
  //       const searchResults = await product_search("shoes");
  //       console.log(searchResults, "search params");
  //     } catch (error) {
  //       console.error("Error in search:", error);
  //     }
  //   };

  //   searchCheck();
  // }, []);
  // const disconnectConversation = useCallback(async () => {
  //   setIsConnected(false);
  //   setRealtimeEvents([]);
  //   setItems([]);
  //   setMemoryKv({});
  //   setCoords({ lat: 37.775593, lng: -122.418137 });
  //   setMarker(null);

  //   const client = clientRef.current;
  //   client.disconnect();

  //   const wavRecorder = wavRecorderRef.current;
  //   await wavRecorder.end();

  //   const wavStreamPlayer = wavStreamPlayerRef.current;
  //   await wavStreamPlayer.interrupt();
  // }, []);

  const disconnectConversation = async () => {
    setIsConnected(false);
    setButtonDisible(false);
    console.log("disconnecting");
    const client = clientRef.current;
    if (client) {
      client.disconnect();
    }

    const wavRecorder = wavRecorderRef.current;
    if (wavRecorder) {
      await wavRecorder.end();
    }

    const wavStreamPlayer = wavStreamPlayerRef.current;
    
    if (wavStreamPlayer) {
      try {
        await Promise.resolve(wavStreamPlayer.interrupt());
      } catch (error) {
        console.error('Error interrupting stream:', error);
      }
    }

    // Clear the inactivity timer
    // clearTimeout(inactivityTimer);
    clearTimer();
  }
  // const connectConversation = useCallback(async () => {
  //   try {
  //     const client = clientRef.current;
  //     const wavRecorder = wavRecorderRef.current;
  //     const wavStreamPlayer = wavStreamPlayerRef.current;

  //     await wavRecorder.begin();
  //     await wavStreamPlayer.connect();
  //     await client.connect();

  //     client.sendUserMessageContent([
  //       {
  //         type: "input_text",
  //         text: "Hello!",
  //       },
  //     ]);

  //     if (client.getTurnDetectionType() === "server_vad") {
  //       await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  //     }
  //     setIsConnected(true);

  //     // Start recording after connection
  //     await startRecording();

  //     // Set inactivity timer for 2 minutes
  //     resetInactivityTimer();
  //   } catch (error) {
  //     console.error("Connection error:", error);
  //     setIsConnected(false);
  //   }
  // }, []);

  const resetInactivityTimer = () => {
    // if (inactivityTimer) {
    //   clearTimeout(inactivityTimer);
    // }
    console.log("resetting inactivity timer");
    // // Inactivity timer for 2 minutes (120000 ms)
    // setInactivityTimer(

    //   setTimeout(() => {
    //     disconnectConversation();
    //     console.log("disconnecting after inactivity");
    //   }, 60000) // 2 minutes
    // );
    clearTimer(); // Ensure any existing timer is cleared before starting a new one
    timerRef.current = setTimeout(() => {
      console.log("disconnecting after inactivity");
      disconnectConversation();
    }, 30000);
  };
  const clearTimer = () => {
    console.log("clearing timer");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  useEffect(() => {
    return () => clearTimer();
    // connectionTimeoutRef.current = setTimeout(() => {
    //   connectConversation();
    // }, 3000); // 10 seconds delay

    // Clean up on unmount
    // return () => {
    //   clearTimeout(connectionTimeoutRef.current);
    //   clearTimeout(inactivityTimer); // Clear inactivity timer if the component unmounts
    // };
  // }, [connectConversation, inactivityTimer]);
  }, []);

  // useEffect(() => {
  //   const handleUserActivity = () => resetInactivityTimer();
  //   window.addEventListener("mousemove", handleUserActivity);
  //   window.addEventListener("touchstart", handleUserActivity);

  //   return () => {
  //     window.removeEventListener("mousemove", handleUserActivity);
  //     window.removeEventListener("touchstart", handleUserActivity);
  //   };
  // }, [inactivityTimer]);
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
      client.appendInputAudio(data.mono);
    });
    clearTimer();
    resetInactivityTimer();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const client = clientRef.current;

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.pause();

    client.createResponse();
  };

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
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevents the context menu from opening
};
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
        const results = await product_search(query);
        console.log(results, "results");
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
        return retrieveCart(localStorage.getItem("cartID"));
      }
    );

    client.addTool(
      {
        name: "checkout",
        description: "Functionality was completed ,Product moved to checkout",
        parameters: {},
      },

      async () => {
        try {
          const checkoutCartlines = [];
          const cartDatas = await retrieveCart(localStorage.getItem("cartID"));
          cartDatas.productDetails.forEach((lineItem) => {
            if (lineItem.productVarientId) {
              checkoutCartlines.push(lineItem.productVarientId);
            }
          });

          if (checkoutCartlines.length === 0) {
            throw new Error("Item not found in cart");
          }

          const checkoutCall = await createCheckout(checkoutCartlines); // Call createCheckout with the cartLineIds

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
    if (!product) {
      return;
    }
    const client = clientRef.current;
    if (client === undefined) {
      return;
    }
    try {
      client.removeTool("add_to_cart");
    } catch (e) {}
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

        const productId = item.product_variant_id;

        quantity = 1;

        if (!localStorage.getItem("cartID")) {
          const cartCreatevalue = await addToCart(productId, quantity).then(
            (res) => {
              setCartId(res.cartCreate.cart.id);
              localStorage.setItem("cartID", res.cartCreate.cart.id);
            }
          );
          const retrivewCartss = await retrieveCart(
            localStorage.getItem("cartID")
          ).then((res) => setRetriviewCart(res));

          console.log(cartCreatevalue, "Voice ==== cartCreatevalue ");
        } else {
          console.log(localStorage.getItem("cartID"), "cartId");
          const updateCartValue = await updateCart(
            localStorage.getItem("cartID"),
            productId,
            quantity
          );
          console.log(updateCartValue, "Voice ==== updateCartValue");
          const retrivewCartss = await retrieveCart(
            localStorage.getItem("cartID")
          ).then((res) => setRetriviewCart(res));
        }

        return {
          message: "product added to cart",
        };
      }
    );
  }, [product]);
  const cartClose = () => {
    setCartVisible(false);
  };
  const cartOpen = () => {
    setCartVisible(true);
  };

  const products = [
    {
      featuredImage: "https://dummyimage.com/1200/09f/fff.png",
      productName: "dummy",
      unit_price: "25",
    },
    {
      featuredImage: "https://dummyimage.com/1200/09f/fff.png",
      productName: "dummy2",
      unit_price: "25",
    },
    {
      featuredImage: "https://dummyimage.com/1200/09f/fff.png",
      productName: "dummy3",
      unit_price: "25",
    },
    {
      featuredImage: "https://dummyimage.com/1200/09f/fff.png",
      productName: "dummy3",
      unit_price: "25",
    },
    {
      featuredImage: "https://dummyimage.com/1200/09f/fff.png",
      productName: "dummy3",
      unit_price: "25",
    },
  ];

  return (
    // <div data-component="ConsolePage">
    //   <div className="content-top mt-16">
    //     <div className="content-title">
    //       <img src="/logo-bars.png" alt="Logo" />
    //       <span>NTP VoiceShop Assistant</span>
    //     </div>
    //     <div className="content-api-key">
    //       {!LOCAL_RELAY_SERVER_URL && (
    //         <Button
    //           icon={Edit}
    //           iconPosition="end"
    //           buttonStyle="flush"
    //           label={`api key: ${apiKey.slice(0, 3)}...`}
    //           onClick={() => resetAPIKey()}
    //         />
    //       )}
    //     </div>
    //   </div>
    //   <div className="content-main mt-26">
    //     <div className="content-logs">
    //       <div className="content-block events ">
    //         {/* <Products /> */}
    //         {product && product.length > 0 ? (
    //           <div
    //             data-component="Products"
    //             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    //           >
    //             {product.map((item, index) => (
    //               <div
    //                 key={item.id || index}
    //                 className="border border-gray-300 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105"
    //               >
    //                 <img
    //                   src={item.featuredImage}
    //                   alt={item.title}
    //                   className="w-full h-auto"
    //                 />
    //                 <div className="p-4 text-center">
    //                   <h4 className="text-lg font-semibold">{item.title}</h4>
    //                   <p className="text-gray-700">Price: ${item.unit_price}</p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         ) : (
    //           <div className="h-28">
    //             <p>No products found</p>
    //           </div>
    //         )}

    //         {checkoutURL ? (
    //           <a
    //             href={checkoutURL}
    //             className="checkout-button"
    //             style={{ width: "200px", padding: "10px" }}
    //           >
    //             Checkout
    //           </a>
    //         ) : null}
    //       </div>
    //       <div className="content-block conversation">
    //         <div className="content-block-title">Conversation</div>
    //         <div className="content-block-body" data-conversation-content>
    //           {!items.length ? "awaiting connection..." : null}
    //           {items.map((conversationItem, i) => (
    //             <div className="conversation-item" key={conversationItem.id}>
    //               <div className={`speaker ${conversationItem.role || ""}`}>
    //                 <div>
    //                   {(
    //                     conversationItem.role || conversationItem.type
    //                   ).replaceAll("_", " ")}
    //                 </div>
    //                 <div
    //                   className="close"
    //                   onClick={() =>
    //                     deleteConversationItem(conversationItem.id)
    //                   }
    //                 >
    //                   <X />
    //                 </div>
    //               </div>
    //               <div className="speaker-content">
    //                 {/* Tool response */}
    //                 {conversationItem.type === "function_call_output" && (
    //                   <div>{conversationItem.formatted.output}</div>
    //                 )}
    //                 {/* Tool call */}
    //                 {!!conversationItem.formatted.tool && (
    //                   <div>
    //                     {conversationItem.formatted.tool.name}(
    //                     {conversationItem.formatted.tool.arguments})
    //                   </div>
    //                 )}
    //                 {!conversationItem.formatted.tool &&
    //                   conversationItem.role === "user" && (
    //                     <div>
    //                       {conversationItem.formatted.transcript ||
    //                         (conversationItem.formatted.audio?.length
    //                           ? "(awaiting transcript)"
    //                           : conversationItem.formatted.text ||
    //                             "(item sent)")}
    //                     </div>
    //                   )}
    //                 {!conversationItem.formatted.tool &&
    //                   conversationItem.role === "assistant" && (
    //                     <div>
    //                       {conversationItem.formatted.transcript ||
    //                         conversationItem.formatted.text ||
    //                         "(truncated)"}
    //                     </div>
    //                   )}
    //                 {conversationItem.formatted.file && (
    //                   <audio
    //                     src={conversationItem.formatted.file.url}
    //                     controls
    //                   />
    //                 )}
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       <div className="content-actions">
    //         <Toggle
    //           defaultValue={false}
    //           labels={["manual", "vad"]}
    //           values={["none", "server_vad"]}
    //           onChange={(_, value) => changeTurnEndType(value)}
    //         />
    //         <div className="spacer" />
    //         {isConnected && canPushToTalk && (
    //           <Button
    //             label={isRecording ? "release to send" : "push to talk"}
    //             buttonStyle={isRecording ? "alert" : "regular"}
    //             disabled={!isConnected || !canPushToTalk}
    //             onMouseDown={startRecording}
    //             onMouseUp={stopRecording}
    //           />
    //         )}
    //         <div className="spacer" />
    //         <Button
    //           label={isConnected ? "disconnect" : "connect"}
    //           icon={isConnected ? X : Zap}
    //           buttonStyle={isConnected ? "regular" : "action"}
    //           onClick={
    //             isConnected ? disconnectConversation : connectConversation
    //           }
    //         />
    //       </div>
    //     </div>
    //     <div className="content-right">
    //       <div className="content-block kv">
    //         <div className="content-block-title">Carts</div>
    //         <div className="content-block-body content-kv">
    //           {retrieveCarts?.productDetails &&
    //           retrieveCarts?.productDetails.length > 0 ? (
    //             <ul className="product-list ">
    //               {retrieveCarts?.productDetails.map((item, index) => (
    //                 <li key={item.id || index} className="product-item">
    //                   <img
    //                     src={item.featuredImage}
    //                     alt={item.productName}
    //                     className="product-thumbnail"
    //                   />
    //                   <div className="product-info">
    //                     <h4>{item.productName}</h4>
    //                     <p>Price: ${item.price}</p>
    //                   </div>
    //                 </li>
    //               ))}
    //             </ul>
    //           ) : (
    //             <p>No products found</p>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="flex flex-col lg:flex-row-reverse lg:w-full  h-30 overflow-hidden font-mono text-sm mt-16 lg:mt-24 font-normal">
        <div className=" lg:w-1/5 ">
          {retrieveCarts?.productDetails &&
            retrieveCarts?.productDetails.length > 0 && (
              // {products && products.length > 0 && (
              <div className="content-block kv m-3 rounded-xl  lg:overflow-visible bg-slate-300 relative">
                <div className="content-block-body content-kv p-4">
                  <ul className="product-list  flex lg:flex-col list-none">
                    {retrieveCarts?.productDetails.map((item, index) => (
                      // {product.map((item, index) => (
                      <li
                        key={item.id || index}
                        className="product-item lg:mt-3 flex items-center "
                      >
                        <img
                          src={item.featuredImage}
                          alt={item.productName}
                          className="product-thumbnail w-[50px] h-[50px] object-cover mr-4 rounded-lg"
                        />
                        <div className="product-info hidden lg:block">
                          <h4>{item.productName}</h4>
                          <p>Price: ${item.price}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
        </div>
        <div className="content-top h-[800px] mb-24 lg:h-[500px] flex flex-grow flex-shrink-1 lg:w-4/5 mx-4 lg:mx-8 overflow-scroll   ">
          <div className="content-logs flex-grow flex flex-col relative ">
            <div className="content-block events  border-t ">
              {/* <Products /> */}
              {product && product.length > 0 ? (
                <div
                  data-component="Products"
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 "
                >
                  {product.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="border border-gray-300 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 -z-50"
                    >
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-full h-auto"
                      />
                      <div className="p-4 text-center">
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className="text-gray-700">
                          Price: ${item.unit_price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-screen w-full text-center font-bold text-2xl items-center flex flex-col justify-center">
                  <TbBasketSearch size="6em" color="gray" />
                  <p className="text-gray-500">
                    {waitMsg
                      ? "Wait for Connecting ..."
                      : isConnected
                      ? "Speak to Search Product"
                      : "Click And Connect Conversation"}
                  </p>
                </div>
              )}
            </div>

            {conversation && (
              <div className="content-block conversation fixed bottom-24 bg-white border-t border-gray-300 flex-shrink-0 w-full overflow-hidden h-[200px] max-h-[200px]">
                <div className="content-block-title">Conversation</div>
                <div className="content-block-body" data-conversation-content>
                  {!items.length ? "awaiting connection..." : null}
                  {items.map((conversationItem, i) => (
                    <div
                      className="conversation-item flex gap-4 mb-4 relative"
                      key={conversationItem.id}
                    >
                      <div
                        className={`speaker ${
                          conversationItem.role || ""
                        } relative text-left gap-4 w-[80px] flex-shrink-0 mr-4`}
                      >
                        <div>
                          {(
                            conversationItem.role || conversationItem.type
                          ).replaceAll("_", " ")}
                        </div>
                        <div
                          className="close absolute top-0 right-[-20px] bg-gray-500 text-white rounded-full p-1 cursor-pointer hover:bg-gray-600"
                          onClick={() =>
                            deleteConversationItem(conversationItem.id)
                          }
                        >
                          <X className="w-3 h-3 stroke-3" />
                        </div>
                      </div>
                      <div className="speaker-content text-gray-800 overflow-hidden break-words">
                        {conversationItem.type === "function_call_output" && (
                          <div>{conversationItem.formatted.output}</div>
                        )}
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
            )}
            {checkoutURL ? (
              <div className="flex w-full justify-center items-center fixed bottom-32 text-center  ">
                <a
                  href={checkoutURL}
                  className="p-4 bg-green-500 font-bold text-lg text-white w-full rounded-lg"
                  style={{ width: "200px", padding: "10px" }}
                >
                  Checkout
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="w-full flex fixed bottom-0 h-24 bg-white ">
        <div className="content-actions flex items-center justify-center gap-4 flex-shrink-0  w-1/3 ">
          <Button
            label={null}
            icon={conversation ? X : Framer}
            className="font-bolds text-2xl bg-black p-4 rounded-3xl text-white active:bg-blue -500 "
            // buttonStyle={isRecording ? "alert" : "regular"}
            onClick={conversation ? closeCon : viewCon}
            // onMouseUp={stopRecording}
          />
        </div>
        <div className="content-actions flex items-center justify-center gap-4 flex-shrink-0  w-1/3 ">
          {/* <Toggle
              defaultValue={false}
              labels={["manual", "vad"]}
              values={["none", "server_vad"]}
              onChange={(_, value) => changeTurnEndType(value)}
            /> */}
          {/* <div className="spacer flex-grow " /> */}

          <div className=" ">
            {isConnected && canPushToTalk && (
              <Button
                label={null}
                icon={Mic}
                className="font-bolds text-2xl bg-sky-600 p-4 rounded-3xl text-white active:bg-red-500 "
                buttonStyle={isRecording ? "alert" : "regular"}
                disabled={!isConnected || !canPushToTalk}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording} // For mobile touch start
                onTouchEnd={stopRecording} 
                onContextMenu={handleContextMenu}
                
              />
            )}

            {!isConnected && (
              <Button
                className="font-bolds  bg-black p-6 rounded-3xl text-white active:bg-emerald-600"
                label={null}
                icon={buttonDisible ? CircularProgress : Codesandbox}
                buttonStyle={isConnected ? "regular" : "action"}
                onClick={() => {
                  connectConversation();
                  setButtonDisible(true); // set the button to disabled
                }}
                disabled={buttonDisible}
              />
            )}
          </div>
        </div>
        {/* <div className=" flex items-center justify-center  flex-shrink-0 w-1/3  ">
          <Button
            className="font-bolds text-2xl bg-black p-4 rounded-3xl text-white active:bg-emerald-600 "
            label={null}
            icon={cartVisible ? X : ShoppingCart} // Set fontSize for the icon
            buttonStyle={
              isConnected ? (cartVisible ? "regular" : "action") : ""
            }
            onClick={cartVisible ? cartClose : cartOpen}
          />
        </div> */}
      </div>
    </>
  );
}
