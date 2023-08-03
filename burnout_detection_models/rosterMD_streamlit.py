import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

st.image("Tab_Logo.png", width = 100)
st.title("RosterMD: Gauging Healthcare Employee Satisfaction")
st.write("Authors: Ansh Bhatti, Abhishek Pillai, Khushi Gupta")
st.write("")

st.header("Introduction")
st.write("The COVID-19 crisis imposed heightened workload and distress on healthcare professionals and staff alike, intensifying workforce challenges. Notably, staffing shortages and a surge in the number of patients worldwide contributed to stressful duty hours day and night. These factors, coupled with the stress of workers' personal lives, directly influence their job satisfaction and job burnout levels." )
st.write("A recent study utilizes data from 50 secondary healthcare institutions in Serbia, surveying 18,642 healthcare workers and 9,283 patients to solidify the relationship between healthcare employee satisfaction and patient satisfaction. When employees have more suitable time available to themselves, their work is much more likely to satisfy patients. A burned out healthcare workforce would only lead to dissatisfaction with the current healthcare system and result in mutual harm to all affected people.")
st.write("With the above in mind, our group started RosterMD, an initiative that addresses health staff shortage and burnout at the same time. Borrowing from the capabilities of genetic algorithms, RosterMD uses qualitative response data from healthcare workers and incorporates that insight, among other parameters, into the optimal scheduling of staff. While the stress of their personal lives is out of control, our app aspires to alleviate their difficulties at work by alloting them to a suitable time based on their feedback and helping them save time for their own health, safety, and personal lives.")

st.header("More About Our Data")
st.write("We applied the [QUAN dataset](https://figshare.com/articles/dataset/QUAN_Strand_Dataset_-_Occupational_Burnout_and_Job_Satisfaction_Among_Physicians_in_Times_of_COVID-19_Crisis_A_Convergent_Parallel_Mixed-Method_Study/14058185/1) to our study. This dataset contains survey responses from 973 employees. Along with personal data such as age, marital status, household size, and salary, the dataset incorporates responses to the 10-Item Burnout Measure-Short version (BMS) and the 5-Item Short Index of Job Satisfaction (SIJS) qualitative assessments to evaluate each worker's state of mind with regards to their workplace. The BMS questionnaire collects data on 10 of the physical and psychological states that the healthcare workforce may undergo, whereas the SIJS considers 5 qualitative parameters to gauge job satisfaction. These responses are then measured against data pertaining to their daily shifts and evaluated for optimal scheduling to minimize burnout score and maximize job satisfaction score.")

st.header("Preliminary Analysis for Burnout Question Responses")

st.write("We first conducted analysis on the relationships between responses to the different burnout prompts.")

df = pd.read_excel("worker_satisfaction.xlsx")
df = df.drop([" REGION", " RESIDENCE TYPE", "COVID-19 INCENTIVES", "COVID-19 STATUS"], axis = 1)

question_mapping = ["Tired", "Disappointed with people", "Hopeless", "Trapped", "Helpless", "Depressed", "Physically weak/Sickly", "Worthless/Like a failure", "Difficulties sleeping", "I've had it"]
burnout_mapping = {"never": 1, "almost never": 2, "rarely": 3, "sometimes": 4, "often": 5, "very often": 6, "always": 7}
satisfaction_mapping = {"strongly disagree": 1, "disagree": 2, "neutral/undecided": 3, "agree": 4, "strongly agree": 5}
workplace_mapping = {"Private Hospitals/Clinics": 0, "University Hospitals": 0, "Jordanian Ministry of Health": 1, "Non-Governmental Organizations": 0, "Jordanian Royal Medical Services": 1}

df["WORKPLACE"] = df.WORKPLACE.map(lambda x: workplace_mapping[x])
df["GENDER"] = df.GENDER.map(lambda x: 0 if x == "Male" else 1)
df["MARITAL STATUS"] = df["MARITAL STATUS"].map(lambda x: 0 if x == "Single" else 1)

for col in df.columns:
  if "Burnout" in col:
    df[col] = df[col].map(lambda x: burnout_mapping[x.strip().lower()])
  elif "Job Satisfaction" in col:
    df[col] = df[col].map(lambda x: satisfaction_mapping[x.strip().lower()])

reversed_case = ["Job Satisfaction Q3", "Job Satisfaction Q5"]
for col in reversed_case:
  df[col] = df[col].map(lambda x: 6-x)

burnout = df[[col for col in df.columns if "Burnout" in col]]
fig = plt.figure(figsize = (12, 6))
sns.heatmap(burnout.corr())
plt.title("Burnout QA Correlation")
st.pyplot(fig)

st.write("We found that the prompts were largely diversified and independent of each other, serving as useful features to us. However, we found that for prompts 3, 4, and 6, which targeted the physical and psychological states of hopelessness and depression, responses were fairly consistent and correlated with coefficients greater than 0.7. COVID-19 was broadly impacting the lives of healthcare workers such that those workers questioned their views about their work, their lives, and themselves.")

burnout_counts = {}
fig2 = plt.figure(figsize = (16, 8))
for i, col in enumerate(burnout.columns):
  print(col)
  counts = burnout[col].value_counts().sort_index()
  plt.plot(counts.index, counts, label = question_mapping[i])

df["Burnout Score"] = df["Burnout Q1"] + df["Burnout Q2"] + df["Burnout Q3"] + df["Burnout Q4"] + df["Burnout Q5"] + df["Burnout Q6"] + df["Burnout Q7"] + df["Burnout Q8"] + df["Burnout Q9"] + df["Burnout Q10"]
df["Burnout Score"] = df["Burnout Score"] / 10
df["Satisfaction Score"] = 0
for i in range(1, 6):
  df["Satisfaction Score"] = df["Satisfaction Score"] + df[f"Job Satisfaction Q{i}"]
df["Satisfaction Score"] = df["Satisfaction Score"] / 5


plt.xlabel("Burnout Question Rating")
plt.ylabel("Frequency")
plt.title("Burnout Rating vs. Frequency")
plt.legend()
st.pyplot(fig2)

st.write("Additionally, we compiled in the plot above responses to the burnout questions, which were answered on a scale of 1 - 7, with 7 indicating extreme burnout and 1 indicating the least. On average, workers were moderately burned out for each of the given physical and psychological states. Among these states, being tired, trapped, and disappointed with surrounding people made healthcare staff burn out the most. Whereas, states such as self-worth and helplessness were less prominent in causing burn out. ")

st.write("Let's now examine how getting burned out on the job is related to workers' job satisfaction, which each worker rated on a scale of 1-5. For all our future plots, we generated new quantitative features called \"Burnout Score\" and \"Satisfaction Score\", which encoded and averaged qualitative responses for better comparison. ")
fig1 = plt.figure(figsize = (12, 6))
plt.title("Job Satisfaction vs. Burnout Scores")
sns.scatterplot(x = df["Burnout Score"], y = df["Satisfaction Score"])
st.pyplot(fig1)
st.write("While there is an expected negative correlation, it may not be as high in magnitude as you may have thought. Among all pairwise relations, a lot of them show that there were more burned out workers that were more satisfied with their job in comparison to less burdened workers. This is where worker metadata comes in as workers' personal lives also have a role to play in how burned out they may feel at work.")

st.subheader("Burnout Question Responses vs. Worker Metadata")

st.write("We employ Burnout and Satisfaction Scores to check for correlation with age, which is one of the most important factors, and other factors. ")

st.markdown("#### Monthly Salary")
fig3 = plt.figure(figsize = (12, 6))
plt.title("Burnout Score as a Function of Age and Monthly Salary")
sns.scatterplot(data = df, x = "AGE", y = "Burnout Score", hue = "MONTHLY SALARY", size = "Satisfaction Score", alpha = 0.7, sizes = (2, 100))
st.pyplot(fig3)

st.write("We analyzed Burnout Score relative to age and salary. While large variability is present in burnout score, there is a triumphing general trend. More aged staff tended to be paid higher and experience a smaller level of burnout in comparison to the lesser paid, younger individuals. Below, we explore how duty hours, rather than monthly salary, affected staff.")

st.markdown("#### Weekly Duty Hours")
fig4 = plt.figure(figsize = (12, 6))
plt.title("Burnout Score as a Function of Age and Weekly Duty Hours")
sns.scatterplot(data = df, x = "AGE", y = "Burnout Score", hue = "DUTY HOURS/WEEK", size = "Satisfaction Score", alpha = 0.7, sizes = (2, 100))
st.pyplot(fig4)
st.write("As expected, higher level of duty hours, which primarily the younger staff handled, corresponded to a higher burnout score. You may notice that even some of the older people who worked extra duty hours were less burned out than the youngsters, which may hint towards the type of occupation that staff may be engaging in. We will examine the type of work next.")

st.markdown("#### Occupation Classification")
fig5 = plt.figure(figsize = (12, 6))
plt.title("Burnout Score as a Function of Age and Occupation Type")
sns.scatterplot(data = df, x = "AGE", y = "Burnout Score", hue = "CLASSIFICATION", size = "Satisfaction Score", alpha = 0.7, sizes = (2, 100))
st.pyplot(fig5)
st.write("The dominant job classification for the more aged seems to be consultancy, for which even duty hours did not manage to negatively affect the burnout scores. General trends in this plot indicate a higher overall burnout index for residents, with general practitioner (aged 24+) and specialists (aged 30+) hitting a close tie. Depending on occupation type, night shifts may be required, which definitely have the potential to further influence burnout scores.")

st.markdown("#### Night Shifts")
fig6 = plt.figure(figsize = (12, 6))
plt.title("Burnout Score as a Function of Age and Night Duty")
sns.scatterplot(data = df, x = "AGE", y = "Burnout Score", hue = "NIGHT SHIFTS/WEEK", size = "Satisfaction Score", alpha = 0.7, sizes = (2, 100))
st.pyplot(fig6)
st.write("In this final part of our analysis, we examine the presence of night shifts relative to staff's age and burnout levels. Staff with larger number of night shifts are moderately to extremely burned out on average. Younger staff tended to have the larger night shifts, which may be a difficulty while they were also pursuing an education. The older staff, consisting of mostly healthcare consultants, had less to no night shifts in comparison. They also had a lower turnout in burnout scores.")

st.header("General Remarks")

st.write("Our analysis on the QUAN dataset and external research aided in our understanding of the situation the COVID-19 crisis had put on healthcare workers. Worker metadata consisted of a basic outlook of their personal lives which, coupled with their responses to well-designed surveys, allowed us to train a machine learning model that can predict an employee's potential burnout score and determine the right algorithm to perform better scheduling of staff workers. In the current situation, not only do staff get tired of working, but hospitals constantly jump between surpluses and shortages of healthcare workers. Optimal scheduling of staff shifts would alleviate this cycle, make sure there are at least enough people to handle those shifts, all while minimizing burnout score.")

st.header("References")

st.write("[1](https://link.springer.com/article/10.1186/s12889-021-10897-4)")
st.write("[2](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3743622/)")
