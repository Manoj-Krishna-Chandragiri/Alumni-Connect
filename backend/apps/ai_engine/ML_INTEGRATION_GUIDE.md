# 🚀 ML Model Integration Guide

## Model 2 Integration (Mentor-Student Matching) ✅ COMPLETE

### 📦 Files Downloaded from Colab:
- `mentor_matching_model.pkl` (XGBoost model, 91% accuracy)
- `matching_scaler.pkl` (Feature scaler)
- `matching_features.pkl` (Feature list)

### 📁 File Placement:

**STEP 1: Place your downloaded `.pkl` files here:**
```
D:\Projects\Alumni-Connect\backend\apps\ai_engine\models\
├── mentor_matching_model.pkl    ← Place here
├── matching_scaler.pkl          ← Place here
└── matching_features.pkl        ← Place here
```

**✅ The `models/` directory has been created for you!**

### 🔧 Integration Files Created:

**1. ML Matcher Engine:**
- **File:** `apps/ai_engine/mentor_matching_ml.py`
- **Class:** `MLMentorMatcher`
- **Features:**
  - Load trained XGBoost model
  - Calculate matching features from student/alumni profiles
  - Predict mentorship success probability
  - Recommend top N mentors for students

**2. API Views:**
- **File:** `apps/ai_engine/views.py` (updated)
- **New Views:**
  - `MLMentorRecommendationView` - Get top mentor recommendations
  - `MLMentorshipPredictionView` - Predict specific pair success
  - `MLBatchMentorAnalysisView` - Batch analysis for counsellors

**3. URL Routes:**
- **File:** `apps/ai_engine/urls.py` (updated)
- **New Endpoints:**
  - `GET /api/ai/ml/mentors/` - Get ML-powered recommendations
  - `POST /api/ai/ml/prediction/` - Predict mentorship success
  - `GET /api/ai/ml/batch-analysis/` - Batch analysis

---

## 📍 API Endpoints Reference

### 1. Get ML-Powered Mentor Recommendations
```
GET /api/ai/ml/mentors/?limit=5
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "alumni_id": 123,
        "name": "John Doe",
        "company": "Google",
        "designation": "Senior Software Engineer",
        "success_probability": 87.5,
        "match_quality_score": 85.2,
        "recommendation": "Highly recommended mentor-mentee pairing!",
        "shared_skills_count": 8,
        "skill_overlap_percentage": 65.0
      }
    ],
    "model": "XGBoost ML Model",
    "accuracy": "91%"
  }
}
```

### 2. Predict Specific Mentorship Success
```
POST /api/ai/ml/prediction/
Authorization: Bearer <token>
Content-Type: application/json

{
  "student_id": 456,
  "alumni_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student_id": 456,
    "alumni_id": 123,
    "alumni_name": "John Doe",
    "prediction": {
      "success_probability": 87.5,
      "will_succeed": true,
      "match_quality_score": 85.2,
      "recommendation": "Highly recommended mentor-mentee pairing!"
    }
  }
}
```

### 3. Batch Analysis (Counsellors/Admins)
```
GET /api/ai/ml/batch-analysis/?batch_year=2024&min_probability=70
Authorization: Bearer <token>
```

---

## 🧪 Testing the Integration

### Step 1: Copy Model Files
```powershell
# From your Downloads folder to the models directory
Copy-Item "C:\Users\<YourUser>\Downloads\mentor_matching_model.pkl" -Destination "D:\Projects\Alumni-Connect\backend\apps\ai_engine\models\"
Copy-Item "C:\Users\<YourUser>\Downloads\matching_scaler.pkl" -Destination "D:\Projects\Alumni-Connect\backend\apps\ai_engine\models\"
Copy-Item "C:\Users\<YourUser>\Downloads\matching_features.pkl" -Destination "D:\Projects\Alumni-Connect\backend\apps\ai_engine\models\"
```

### Step 2: Install Required Packages
```bash
cd D:\Projects\Alumni-Connect\backend
pip install joblib pandas numpy scikit-learn xgboost
```

### Step 3: Test Import (Django Shell)
```bash
python manage.py shell
```

```python
from apps.ai_engine.mentor_matching_ml import MLMentorMatcher

# Load the model
matcher = MLMentorMatcher()
# Should print: ✅ Mentor matching model loaded successfully!

# Test with a student
recommendations = matcher.recommend_top_mentors(student_id=1, limit=5)
print(recommendations)
```

### Step 4: Test API Endpoints
```bash
# Start server
python manage.py runserver

# Test with curl or Postman
curl -H "Authorization: Bearer <your_token>" \
     http://localhost:8000/api/ai/ml/mentors/?limit=5
```

---

## 🔄 Next Steps: Model 1 (Career & Job Prediction)

After Model 2 is working, run **Model 1** in Google Colab to get:
- `placement_prediction_model.pkl`
- `salary_prediction_model.pkl`
- `feature_scaler.pkl`
- `department_encoder.pkl`
- `feature_columns.pkl`

These will be integrated similarly for:
- Career success prediction
- Salary prediction
- Job recommendations

---

## 📊 Model Performance Summary

**Model 2 Results:**
- **Algorithm:** XGBoost
- **Accuracy:** 91.00%
- **F1-Score:** 0.9237
- **ROC-AUC:** 0.9720
- **Precision:** 0.9561
- **Recall:** 0.8934

**Training Data:**
- 1,000 mentor-student pairs
- 15 features
- 61% success rate baseline

---

## 🐛 Troubleshooting

### Error: "Model file not found"
**Solution:**
- Verify files are in `apps/ai_engine/models/`
- Check file names match exactly (case-sensitive)

### Error: "Module not found: joblib/pandas/xgboost"
**Solution:**
```bash
pip install joblib pandas numpy scikit-learn xgboost
```

### Error: "AlumniProfile has no attribute 'available_for_mentoring'"
**Solution:**
- Update your AlumniProfile model to include this field
- Or modify `mentor_matching_ml.py` to use existing fields

### Error: "Feature mismatch"
**Solution:**
- Ensure all 15 features are being calculated correctly
- Check `matching_features.pkl` for expected feature list
- Verify feature order matches training data

---

## 💡 Tips

1. **Performance:** Model loads once on first request, then cached
2. **Debugging:** Set `DEBUG=True` in settings to see detailed errors
3. **Logging:** Add logging to track predictions and performance
4. **Updates:** Retrain models monthly with new data for better accuracy
5. **A/B Testing:** Compare ML results with original TF-IDF approach

---

## 📚 Documentation

- **Original Engine:** TF-IDF based recommendations (kept for fallback)
- **New ML Engine:** XGBoost trained on 1,000 historical mentor-student pairs
- **Hybrid Approach:** Use ML for mentor matching, TF-IDF for jobs/skills

---

## ✅ Checklist

- [x] Created `models/` directory
- [x] Created `mentor_matching_ml.py` integration file
- [x] Updated `views.py` with ML endpoints
- [x] Updated `urls.py` with new routes
- [ ] **YOU:** Copy 3 `.pkl` files to `models/` directory
- [ ] **YOU:** Install required packages (joblib, pandas, xgboost)
- [ ] **YOU:** Test in Django shell
- [ ] **YOU:** Test API endpoints
- [ ] **YOU:** Run Model 1 in Colab for career predictions

---

**🎉 Ready to use! Just copy the model files and test!**
