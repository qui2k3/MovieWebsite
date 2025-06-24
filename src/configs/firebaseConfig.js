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
  addDoc,
  serverTimestamp,
  query,
  where,
  deleteDoc,
  getDocs,
  doc,
  setDoc,
  runTransaction, // <--- THÊM DÒNG NÀY VÀO ĐÂY
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

    // MỚI: Lưu thông tin người dùng vào Firestore 'users' collection
    if (user) {
      // Đảm bảo user object tồn tại
      const userDocRef = doc(db, "users", user.uid); // Document ID là UID của user
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email, // Email có thể là null nếu Facebook không cung cấp hoặc user từ chối
          photoURL: user.photoURL,
          lastLoginAt: serverTimestamp(), // Thời gian đăng nhập gần nhất
          // creationTime từ user.metadata là string, chuyển sang ISO string hoặc Timestamp
          createdAt: user.metadata?.creationTime
            ? new Date(parseInt(user.metadata.creationTime)).toISOString()
            : null,
        },
        { merge: true }
      ); // Merge: true để cập nhật thông tin nếu user đã tồn tại
      console.log(
        `Firebase: Thông tin user '${user.displayName}' đã được lưu vào Firestore.`
      );
    }

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
export const addWatchHistory = async (
  movieData,
  episodeInfo = {},
  sessionDurationSeconds = 0
) => {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const movieDocRef = doc(
      db,
      "users",
      userId,
      "watchHistory",
      movieData.slug
    );

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(movieDocRef);
        let currentTotalDuration = 0;

        if (sfDoc.exists) {
          // SỬA ĐỔI: Thêm || {} để đảm bảo existingData luôn là một đối tượng
          const existingData = sfDoc.data() || {}; // <-- THAY ĐỔI DÒNG NÀY
          currentTotalDuration =
            existingData.total_watched_duration_seconds || 0;
        }

        const newTotalDuration = currentTotalDuration + sessionDurationSeconds;

        transaction.set(
          movieDocRef,
          {
            userId: userId,
            movieId: movieData.id,
            title: movieData.title,
            genres: movieData.genres || [],
            poster_url: movieData.poster_url,
            thumb_url: movieData.thumb_url,
            year: movieData.year,
            slug: movieData.slug,

            watchedAt: serverTimestamp(),
            lastWatchedEpisodeSlug: episodeInfo.slug || null,
            lastWatchedEpisodeName: episodeInfo.name || null,
            total_watched_duration_seconds: newTotalDuration,
          },
          { merge: true }
        );
      });

      console.log(
        `Firebase: Lịch sử xem phim "${movieData.title}" (tập ${
          episodeInfo.name || "mới nhất"
        }) đã được LƯU/CẬP NHẬT vào Firestore! Xem +${sessionDurationSeconds}s.`
      );
    } catch (e) {
      console.error("Firebase: Lỗi khi thêm/cập nhật lịch sử xem phim: ", e);
      // Thêm kiểm tra lỗi chi tiết để hiểu rõ hơn
      if (e.code === "permission-denied") {
        console.error(
          "Firebase: Lỗi quyền truy cập. Kiểm tra Firestore Security Rules!"
        );
      } else if (e.message && e.message.includes("A document does not exist")) {
        console.error(
          "Firebase: Lỗi giao dịch. Document mục tiêu có thể không tồn tại hoặc đã bị xóa giữa chừng."
        );
      }
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
export const deleteWatchHistoryItem = async (movieSlug, userId) => {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    console.warn(
      "Firebase: Không được phép xóa lịch sử xem phim của người dùng khác hoặc chưa đăng nhập."
    );
    return false;
  }
  const movieDocRef = doc(db, "users", userId, "watchHistory", movieSlug);

  try {
    await deleteDoc(movieDocRef);
    console.log(`Firebase: Đã xóa lịch sử xem phim '${movieSlug}' thành công.`);
    return true;
  } catch (e) {
    console.error(`Firebase: Lỗi khi xóa lịch sử xem phim '${movieSlug}': `, e);
    return false;
  }
};
