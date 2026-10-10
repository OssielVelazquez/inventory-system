# 📦 Inventory System - Full Stack

Full stack inventory management system with JWT authentication and role-based access control.

## 🚀 Stack

**Backend**
- Java 23
- Spring Boot 3.5
- Spring Security + JWT
- PostgreSQL 17
- Hibernate / JPA

**Frontend**
- React 18
- React Router 6
- Axios

## ✨ Features

- JWT authentication
- Role-based access control (ADMIN, MANAGER, USER)
- Product, category and stock management
- User management (admin only)
- Dashboard with inventory statistics
- Low stock alerts

## 🎯 Roles & Permissions

| Action | USER | MANAGER | ADMIN |
|--------|:----:|:-------:|:-----:|
| View products/categories/stock | ✅ | ✅ | ✅ |
| Create/edit products | ❌ | ✅ | ✅ |
| Delete products | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## 🔧 Getting Started

### Requirements

- Java 23+
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd inventory-api
# Configure database credentials in src/main/resources/application.yaml
mvn spring-boot:run
