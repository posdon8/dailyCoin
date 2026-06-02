import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:5000/api";

// Cấu hình load test: 50 virtual users (VU)
export const options = {
    stages: [
        { duration: "10s", target: 10 }, // Ramp-up: 0 -> 10 users
        { duration: "30s", target: 50 }, // Ramp-up: 10 -> 50 users
        { duration: "20s", target: 50 }, // Stay at 50 users
        { duration: "10s", target: 0 },  // Ramp-down: 50 -> 0 users
    ],
    thresholds: {
        http_req_duration: ["p(95)<500"], // 95% requests phải < 500ms
        http_req_failed: ["rate<0.1"],    // Failure rate < 10%
    },
};

export function setup() {
    // Chỉ kiểm tra server có chạy không
    const testRes = http.get(`${BASE_URL}/expenses`);
    return { baseUrl: BASE_URL };
}

export default function (data) {
    // Mỗi VU login riêng để lấy token riêng
    const loginRes = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify({
            email: "vusitam2882@gmail.com",
            password: "123456"
        }),
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    check(loginRes, {
        "login successful": (r) => r.status === 200,
        "token received": (r) => r.json().token !== undefined,
    });

    if (loginRes.status !== 200) {
        return; // Dừng nếu login fail
    }

    const token = loginRes.json().token;
    
    // Dữ liệu tạo chi tiêu
    const categories = ["Food", "Transport", "Entertainment", "Shopping", "Health", "Utilities", "Other"];
    const descriptions = [
        "Lunch at restaurant",
        "Taxi fare",
        "Movie tickets",
        "Online shopping",
        "Medicine",
        "Electricity bill",
        "General expense"
    ];

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomAmount = Math.floor(Math.random() * 1000) + 50; // 50 - 1050
    const today = new Date().toISOString().split("T")[0];

    const expenseData = {
        amount: randomAmount,
        category: randomCategory,
        description: randomDescription,
        date: today,
        tags: ["test", "k6"],
        notes: `Load test with ${__VU} VU`
    };

    // Test: Tạo chi tiêu mới
    const createRes = http.post(
        `${BASE_URL}/expenses`,
        JSON.stringify(expenseData),
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    check(createRes, {
        "create expense status 200": (r) => r.status === 200,
        "expense created successfully": (r) => r.json().success === true,
        "expense has _id": (r) => r.json().data?._id !== undefined,
    });

    // Test: Lấy danh sách chi tiêu
    const getRes = http.get(
        `${BASE_URL}/expenses`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    check(getRes, {
        "get expenses status 200": (r) => r.status === 200,
        "expenses list returned": (r) => r.json().success === true,
    });

    sleep(1);
}