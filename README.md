
# ResQ AI

## Autonomous Crisis Coordination Platform

ResQ AI is an autonomous crisis coordination platform designed to assist emergency response teams during high-pressure disaster scenarios. Unlike traditional emergency management systems that primarily visualize incidents and resource availability, ResQ AI focuses on decision-making under scarcity.

The platform continuously analyzes incoming incidents, evaluates risk, resolves resource conflicts, and generates explainable allocation recommendations to help emergency responders make faster and more informed decisions when resources are limited.


<img width="1888" height="983" alt="image" src="https://github.com/user-attachments/assets/78edcc6e-f8ab-420d-8146-27ce30f28258" />

---

## Problem Statement

During disasters such as floods, cyclones, earthquakes, and large-scale urban emergencies, responders often face a critical challenge:

Multiple emergencies occur simultaneously while available resources remain limited.

Existing emergency management platforms are effective at:

* Monitoring incidents
* Displaying maps
* Tracking assets
* Collecting reports

However, they rarely assist responders in answering the most important operational question:

**Given limited resources and multiple competing emergencies, what should happen next?**

Decision-making during these situations often depends on manual coordination, fragmented information, and time-sensitive human judgment.

---

## Our Solution

ResQ AI introduces an autonomous coordination layer for emergency operations.

The platform transforms raw incident data into actionable recommendations through a multi-agent architecture capable of:

* Incident analysis
* Risk assessment
* Resource prioritization
* Conflict resolution
* Dynamic replanning
* Explainable decision support

Instead of functioning as a passive dashboard, ResQ AI actively evaluates operational scenarios and recommends optimal deployment strategies based on urgency, impact, and resource availability.

---

## Key Features

### Autonomous Incident Prioritization

Incoming incidents are analyzed and ranked according to severity, urgency, population impact, and operational constraints.



<img width="1888" height="982" alt="image" src="https://github.com/user-attachments/assets/2560d70f-b038-4c81-a63d-5c32a2b5bc07" />

### Resource Conflict Resolution

When multiple emergencies compete for the same limited resource, ResQ AI evaluates competing priorities and recommends the most effective allocation strategy.


<img width="1576" height="736" alt="image" src="https://github.com/user-attachments/assets/7440ffee-34a0-4788-8a3a-5be80cd52619" />


### Explainable Decision Making

Every recommendation includes a transparent reasoning trail and confidence score, ensuring that emergency operators understand why a particular decision was made.


<img width="1871" height="987" alt="image" src="https://github.com/user-attachments/assets/0c06b657-0244-4847-9c62-5e0fb6f910b5" />


### Dynamic Replanning

The system continuously adapts to changing conditions such as:

* New emergencies
* Resource failures
* Route disruptions
* Escalating threats

  
<img width="1912" height="987" alt="image" src="https://github.com/user-attachments/assets/0986dea5-63ae-4c6e-96a0-b199694eb874" />

### Crisis Coordination Dashboard

A centralized command interface provides situational awareness, resource tracking, incident monitoring, and decision timelines.


<img width="1895" height="972" alt="image" src="https://github.com/user-attachments/assets/cdf3804c-86d0-4904-9fc0-2f00186bbb5b" />

---

## System Architecture

ResQ AI follows a layered autonomous decision-making architecture.

### 1. Perception Layer

Responsible for collecting and structuring incoming emergency information.

Inputs include:

* Citizen reports
* Emergency alerts
* Incident feeds
* Operational updates

### 2. Risk Assessment Layer

Evaluates:

* Severity
* Urgency
* Impact radius
* Population affected
* Resource requirements

Outputs a priority score for each incident.

### 3. Autonomous Coordination Layer

Acts as the system's reasoning engine.

Responsibilities include:

* Conflict detection
* Priority comparison
* Resource allocation
* Decision recommendation

### 4. Resource Allocation Engine

Generates deployment plans and coordinates resource assignments.


<img width="1370" height="965" alt="image" src="https://github.com/user-attachments/assets/54b2bb6e-fd98-4532-8f0f-4c763f6cf7c4" />

---

## Multi-Agent Workflow

### Signal Agent

Processes incoming reports and converts them into structured operational incidents.

### Risk Assessment Agent

Calculates severity and urgency scores for each incident.

### Conflict Resolver Agent

Evaluates competing incidents when resources are constrained and determines optimal allocation strategies.

### Dispatch Agent

Generates deployment recommendations and action plans for emergency responders.

---

## Example Scenario

Flood conditions create three simultaneous emergencies:

1. Child requiring immediate medical evacuation
2. Family stranded on a rooftop
3. Shelter experiencing critical supply shortages

Available resources:

* One rescue boat
* One ambulance
* Limited response personnel

ResQ AI evaluates urgency, survival impact, and resource availability before generating a prioritized response plan and allocation recommendation.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* React Leaflet

### Backend

* FastAPI
* Python

### Database

* SQLite

### AI & Coordination Layer

* Gemini API
* Multi-Agent Orchestration
* Event-Driven Decision Logic

---

## Impact

ResQ AI aims to improve emergency response operations by:

* Reducing decision-making delays
* Improving resource utilization
* Increasing operational transparency
* Supporting responders under pressure
* Enabling faster and more informed crisis coordination

Potential applications include:

* Flood response
* Cyclone management
* Earthquake recovery
* Wildfire operations
* Urban emergency coordination

---

## Future Roadmap

* Real-time government data integration
* Predictive disaster modeling
* Drone-assisted response coordination
* Multi-agency collaboration framework
* Multi-city crisis management networks
* Advanced simulation and training environments

  <img width="1068" height="713" alt="image" src="https://github.com/user-attachments/assets/2f746b7b-6fac-442b-8f10-f2df02f19a3d" />


---

## Team

Developed as part of the FAR AWAY 2026 Hackathon under the Agentic & Autonomous Systems theme.

ResQ AI represents our vision for the next generation of intelligent emergency response systems—systems that not only observe crises, but actively help coordinate responses when every second matters.

---

## License

This project is intended for educational, research, and innovation purposes.
