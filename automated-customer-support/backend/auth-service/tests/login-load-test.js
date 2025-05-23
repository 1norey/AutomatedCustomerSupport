import http from "k6/http";
import { check } from "k6";

export default function () {
  const url = "http://localhost:8080/api/auth/login";
  const payload = JSON.stringify({
    email: "youruser@email.com",
    password: "Test123!"
  });
  const params = { headers: { "Content-Type": "application/json" } };

  let res = http.post(url, payload, params);
  check(res, { "status is 200": (r) => r.status === 200 });
}
