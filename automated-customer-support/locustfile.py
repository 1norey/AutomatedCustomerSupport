from locust import HttpUser, task, between

class AuthUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def login(self):
        self.client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
