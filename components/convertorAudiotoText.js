// import axios from "axios";

// const convertAudioToText = async (audioData) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", new Blob([audioData], { type: "audio/wav" }));

//     const response = await axios.post(
//       "https://api.flixier.com/transcribe",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     if (response.data && response.data.transcript) {
//       return response.data.transcript;
//     } else {
//       throw new Error("Failed to convert audio to text");
//     }
//   } catch (error) {
//     console.error("Error converting audio to text:", error);
//     throw error;
//   }
// };

// export default convertAudioToText;
