---
title: "🎓 Literal User Listening vs. Data Literacy"
description: "Building exactly what users ask for can fail if users do not actually understand the underlying technical requirements of the problem."
date: 2026-06-15
---
# 🎓 Literal User Listening vs. Data Literacy

Building exactly what users ask for can fail if users do not actually understand the underlying technical requirements of the problem.

---

## Lago v1 (YC S21)
* **What they built**: The founders originally got into YC by pitching a pure software "no-code Reverse ETL" tool. The goal was to allow non-technical growth marketers to extract customer data directly from a company's data warehouse without needing to write SQL or wait on data engineers.
* **The Failure**: They fell into the ultimate product-management trap: building exactly what users asked for instead of what they actually needed. Marketers said their biggest problem was "SQL literacy" and that a no-code UI would solve everything. However, the founders quickly realized the actual blocker was "data literacy." The marketers didn't understand the underlying database structures, how the tables linked together, or how to do lightweight data modeling. Giving them a beautiful no-code software tool didn't fix their fundamental unwillingness to understand the data architecture.
* **The Outcome**: Realizing they were building software for a persona that didn't actually want to do the required work, the founders executed a brilliant and brutal hard pivot. They abandoned the marketing tool entirely and rebuilt Lago as an open-source metering and billing API for developers—which successfully found immense product-market fit.
---

### 💡 Key Takeaway
For startups in this category, the core challenge is not the code but the surrounding market dynamics. Ensure you validate this bottleneck before scaling.
