# System Architecture

## Overview
Stock HR uses a microservices architecture with event-driven communication.

## Service Components

### Auth Service
- JWT token management
- WebAuthn implementation
- Rate limiting
- Session management

### Analytics Service
```mermaid
graph TB
    Data[Raw Data] --> ETL[ETL Pipeline]
    ETL --> Processing[Data Processing]
    Processing --> ML[ML Models]
    ML --> Predictions[Predictions]
    ML --> Insights[Insights]
    
    Processing --> Stream[Stream Processing]
    Stream --> RT[Real-time Analytics]
    RT --> Dashboard[Dashboard]
```

### Data Flow
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Cache
    participant DB
    participant Queue
    
    Client->>API: Request
    API->>Cache: Check Cache
    Cache-->>API: Cache Miss
    API->>DB: Query Data
    DB-->>API: Data
    API->>Queue: Event
    API-->>Client: Response
```
