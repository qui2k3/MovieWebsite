// src/firebaseConfig.js

// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"; // Thêm Auth
import {
  getFirestore,
  collection,
  addDoc, // Bạn có thể giữ hoặc bỏ addDoc tùy bạn, nó không dùng nữa cho chức năng này
  serverTimestamp,
  query,
  where,
  getDocs,
  doc, // <--- THÊM DÒNG NÀY
  setDoc, // <--- THÊM DÒNG NÀY
} from "firebase/firestore";

// Lưu ý: Bạn có thể bỏ dòng getDatabase nếu không dùng Realtime Database
// import { getDatabase } from "firebase/database";

// Cấu hình Firebase của bạn
// Bạn đang truy cập biến môi trường VITE_FIREBASE_API_KEY, điều này là đúng cho Vite.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "api-firebase-moviewebsite.firebaseapp.com",
  projectId: "api-firebase-moviewebsite",
  storageBucket: "api-firebase-moviewebsite.firebasestorage.app",
  messagingSenderId: "590093435285",
  appId: "1:590093435285:web:e284ad54c0c7365953769c",
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ Firebase cần thiết và export chúng
export const auth = getAuth(app); // Dịch vụ Firebase Authentication
export const db = getFirestore(app); // Dịch vụ Firebase Firestore

// Nếu bạn vẫn muốn sử dụng Realtime Database, bạn có thể giữ dòng này,
// nhưng nó không liên quan đến việc đăng nhập Facebook và lịch sử xem phim bằng Firestore.
// const database = getDatabase(app);
// export { app, database };

// --- Các hàm tiện ích cho Authentication và Firestore ---

// Hàm đăng nhập bằng Facebook
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Đăng nhập thành công!", user);
    return user;
  } catch (error) {
    console.error("Lỗi đăng nhập Facebook:", error.code, error.message);
    if (error.code === "auth/account-exists-with-different-credential") {
      alert("Tài khoản đã tồn tại với một phương thức đăng nhập khác.");
    } else if (error.code === "auth/popup-closed-by-user") {
      console.log("Người dùng đã đóng popup.");
    }
    throw error;
  }
};

// Hàm đăng xuất
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Đăng xuất thành công!");
  } catch (error) {
    console.error("Lỗi đăng xuất:", error.message);
  }
};

// Hàm theo dõi trạng thái đăng nhập
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Hàm lưu lịch sử xem phim vào Firestore
export const addWatchHistory = async (movieData, episodeInfo = {}) => {
  // episodeInfo là tham số mới
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    // Định nghĩa tham chiếu đến document. ID của document sẽ là slug của phim.
    // Đường dẫn: users/{userId}/watchHistory/{movieSlug}
    const movieDocRef = doc(
      db,
      "users",
      userId,
      "watchHistory",
      movieData.slug
    );

    try {
      await setDoc(
        movieDocRef, // Tham chiếu document
        {
          userId: userId, // Vẫn lưu userId trong document (tốt cho quy tắc bảo mật)
          movieId: movieData.id,
          title: movieData.title,
          genres: movieData.genres || [],
          poster_url: movieData.poster_url, // Đảm bảo movieData có các trường này
          thumb_url: movieData.thumb_url, // Đảm bảo movieData có các trường này
          year: movieData.year, // Đảm bảo movieData có các trường này
          slug: movieData.slug, // Lưu slug vào document

          watchedAt: serverTimestamp(), // Cập nhật thời gian xem gần nhất
          lastWatchedEpisodeSlug: episodeInfo.slug || null, // Lưu slug của tập cuối
          lastWatchedEpisodeName: episodeInfo.name || null, // Lưu tên tập cuối
        },
        { merge: true } // QUAN TRỌNG: Cập nhật các trường đã có và thêm các trường mới
      );
      console.log(
        `Firebase: Lịch sử xem phim "${movieData.title}" (tập ${
          episodeInfo.name || "mới nhất"
        }) đã được LƯU/CẬP NHẬT vào Firestore!`
      );
    } catch (e) {
      console.error("Firebase: Lỗi khi thêm/cập nhật lịch sử xem phim: ", e);
    }
  } else {
    console.warn(
      "Firebase: Người dùng chưa đăng nhập. Không thể lưu lịch sử xem phim."
    );
  }
};

// Hàm lấy lịch sử xem phim từ Firestore của người dùng hiện tại
export const getWatchHistory = async () => {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    // Tham chiếu đến subcollection watchHistory của người dùng hiện tại
    const historyCollectionRef = collection(
      db,
      "users",
      userId,
      "watchHistory"
    );

    try {
      const querySnapshot = await getDocs(historyCollectionRef);
      const history = querySnapshot.docs
        .map((doc) => ({
          id: doc.id, // ID của document sẽ là movieSlug
          ...doc.data(),
        }))
        .sort(
          (a, b) => (b.watchedAt?.seconds || 0) - (a.watchedAt?.seconds || 0)
        ); // Sắp xếp theo thời gian xem gần nhất
      return history;
    } catch (error) {
      console.error(
        "Firebase: Lỗi khi lấy lịch sử xem phim từ Firestore:",
        error
      );
      return [];
    }
  }
  return [];
};
