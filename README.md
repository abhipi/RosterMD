# RosterM.D.: Putting the Health back in Healthcare

<img width="600" alt="image" src="https://github.com/abhipi/RosterMD/assets/75244191/6d07a85a-4b72-4a88-8d98-c4637876b72b"><br>
* <b>Team Members</b>: Ansh Bhatti, Khushi Gupta, Abhishek Pillai
* <b>Link to Devpost</b>: https://devpost.com/software/rostermd
* <b>Link to StreamLit</b>: https://anshbhatti-rostermd-rostermd-streamlit-qkhacp.streamlit.app/
* <b>Winner: Hacklytics '23 (Georgia Tech), Top 5: Startup Exchange's Summit ATL Pitch Competition, Selected for CREATE-X Startup Launch (Accelerator)</b>

<img width="600" alt="image" src="https://github.com/abhipi/RosterMD/assets/75244191/0589e8e2-3787-4a83-b309-a10e0db0b02b">
<img width="600" alt="image" src="https://github.com/abhipi/RosterMD/assets/75244191/bc654087-2b8a-4546-96af-23bbb62cce57">

## To-Do
- [x] Build Flask API for calls to CM-BERT model, CNN, and Genetic Scheduler. 
- [x] Finish shift scheduling component.
- [x] Finish audio display while recording.
- [x] Deploy COVAREP as MATLAB Archive.
- [ ] Lower latency in final API call to burnout predictor.

Uses:
* https://github.com/thuiar/Cross-Modal-BERT
* https://github.com/jaekookang/p2fa_py3
* <b>Link to trained model</b>: https://drive.google.com/file/d/19EGRhh8BiNbtKPw-UEMVxf0_60SJA64q/view?usp=sharing

# Original Submission (Hacklytics '23)

## Inspiration

Imagine this scenario: You come back home from a 30 hour shift at your ill-managed residency hospital, after completing innumerable records and changing infinite IVs. You’re looking forward to taking a much-needed and well-deserved break when you remember you have an anatomy exam in 48 hours that you need to study for. How would you feel?

This is the reality of thousands of residents all across the US and even around the rest of the World. Poor schedule management and a lack of consideration for an employee’s mental health have made the life of an already stressed workforce considerably worse. While this problem has been persistent for years, the recent COVID-19 crisis imposed heightened workload and distress on healthcare professionals and staff alike, intensifying workforce challenges. According to a study from HSS[1], up to 60% of medical students reported severe symptoms of burnout and more than 50% of public health workers were recorded to be suffering from at least one mental health condition. 

Why should you care? Well, as stated by the Surgeon General’s advisory, “if we fail to act on this, we will place our nation’s health at risk.” There’s a multitude of studies that directly link employee satisfaction with their job performance. The worse the employee’s health, the more likely they are to make mistakes that can eventually be life-threatening.

So who’s going to save us from this hidden but catastrophic public health crisis? Well, that’s where RosterM.D. comes in! 

## What it does

With the above in mind, our group conceptualized RosterM.D., an initiative that addresses Health Staff Shortage and Burnout at the same time. Borrowing from the capabilities of Genetic Algorithms, RosterM.D. uses data from healthcare workers and uses their responses to well-established questionnaires to help gauge their levels of burnout and provide an optimal scheduling of working shifts for staff. Our app aspires to alleviate workers’ difficulties by allotting them a suitable time based on their Personal Lives and Feedback and helping them do away with fatigue for their own health and safety- and for those around them.

Essentially, our product is a WebApp which allows Healthcare Institutions to Manage their Staff and Generate Shift Schedules for Sustainable Patient Care. This is how it works:

A hospital creates an account on the RosterM.D. WebApp and Inputs Profiles of all their workers including pivotal data points like Salary, Job Position, Family Status etc. The Genetic Algorithm generates a baseline weekly schedule, accounting for burnout, that can be further edited spontaneously based on worker’s weekly preferences. Then, the institution can set up accounts for administrative staff and doctors alike. Administration accounts provide access to profiles of employees working under them and allow them to modify the weekly schedules created by the algorithm. Doctor accounts allow them to view their schedules for the upcoming week, fill out shift preferences for the following week as well as fill out regular surveys to report their satisfaction with the schedules, across Medical Procedures. 

## How we built it

This project is composed of three components that we implemented and merged onto a pipeline: Data Analysis and Modeling, Backend API applying the Scheduling Algorithm, and an Intuitive User Interface synthesizing it all. 

For data analysis and modeling, we utilized the Pandas library in Python. We imported our dataset of 973 employees’ metadata and questionnaire responses[2][3]. We cross-correlated data features together and generated plots to understand our data, which is representative of the healthcare workforce during the COVID-19 crisis, better. We applied machine learning to be able to predict a worker’s burnout score using each worker’s metadata, information about their shifts, and their responses to questionnaires gauging psychological and physical states. We compiled a Research Report that discusses our dataset and analysis in detail on the “About Us” page (StreamLit). 

For the scheduling algorithm, we implemented a genetic algorithm in Python to take worker metadata and their working shift preferences as input. The algorithm uses this input to provide an optimal schedule of staff shifts, avoiding shortage and alleviating burden on workers. We separated our input data into hard and soft constraints for optimization purposes and assigned each of those constraints carefully trained weights. We also developed a RESTful API using Python’s Flask framework to accept requests from the UI and apply the scheduling algorithm based on worker’s shift preferences.

The two algorithms were interwoven in JavaScript (JSX, React) and JSON, built into a React Frontend Service. We employed libraries like Chakra and React Fetch API to pass inputs to and from our two networks. The design is intuitive, with the essentials combined on a single dashboard. To authenticate users, we employed a combination of Google Cloud Features: Firebase’s Real- Time Database for Auth and Firestore, for Storage and Manipulation (So that you grasp it as soon as you see it).


## Challenges we ran into


The dataset was missing key parameters that we could have used further to analyze which features cause the most burnout. Worker metadata could have, for example, consisted of more data inputs such as financial liabilities (med school being one of them), health problems, commute time and costs, and other time-expending commitments. Moreover, the dataset we obtained primarily consisted of categorical data, even for data that could have been numerical. This made it tougher to perform the task of predicting burnout scores given the variability in burnout scores. It was a limitation of the dataset, so we just made our best attempt to find the right algorithm, and achieved a mean squared error of 0.75 from our model on a test size of 194 employees with burnout scores ranging from 1-7. 

On the algorithmic side of things, we also ran into optimization issues. We first used greedy algorithms to create the ideal schedule as a lot of prior scheduling problems had made use of it. Moreover, all three of our teammates had worked with them before and felt confident about the approach. However, regardless of how many parameters we changed, the greedy algorithm was never able to come up with even a feasible schedule (let alone an optimal one). Halfway into the datathon, we realized that to create something truly useful we would have to change our approach. 

Thus began a deep dive into every solution that has ever been used for scheduling problems. In our research we shortlisted a few options but were hesitant to work with any due to our lack of experience. After further research into each algorithm, we settled upon genetic algorithms as our algorithm of choice, since it was more intuitive than others. A lot of hours went into understanding the workings of the algorithms and learning how to implement it into code, but eventually we were able to provide a feasible schedule that heavily reduced administrative costs.  


## Accomplishments that we're proud of

Following upon the previous section, the accomplishment that we’re truly the most proud of is using a technology we had never worked with before and actually accomplishing results. Our initial randomly produced schedule had 482 hard constraint violations i.e. 482 non feasible entries, not to mention an additional 323 soft constraint violations. Our final genetically optimized schedule had not only 0 hard constraint violations, but also only 142 soft constraint violations (reduced by more than 50%). This algorithm was able to incorporate so many important variables of an employee’s life that would normally be entirely ignored, drawing attention to the novelty of the system. Furthermore, it is important to note that existing scheduling systems often violate the hard constraints we have in place. Consecutive shifts of 16 hours are incredibly common and so is the practice of overallotting one employee while underallotting another. RosterM.D. was able to entirely eliminate these, ensuring a much healthier healthcare workforce.

## What's next for RosterM.D.

With all that RosterM.D. has accomplished, we are also incredibly aware of the huge scope this initiative has. 

Due to the lack of awareness about the severity of this issue, there was also a major lack of robust datasets. As we already outlined, not only was there only one dataset for us to work with, the data was also too categorical and missing various useful parameters. Therefore, in the future, our main goal would be to partner with hospitals to collect the exact type of data in the precise format that we’re looking for. Once data acquisition is completed, we’ll run our software to create a schedule and implement the same in hospitals, collecting feedback and improving our system.

We also want to incorporate other features like allowing administrative staff to measure employee performance that we can further incorporate into our algorithm. Better performing employees can be rewarded with less night shifts or less consecutive shifts. Additionally, they can also be investigated to understand factors contributing to their best performance.


This datathon is only the beginning for RosterM.D.!


## Frameworks Employed
1. Python
  - Pandas, seaborn, scikit-learn: perform data analysis, generate plots, and develop machine learning models to predict burnout scores
  - Flask: create an API to handle requests between UI and the scheduling algorithm application
  - Deap: support framework for the scheduling algorithm, which borrows the capabilities of genetic algorithms
2. ReactJS: Develop a host user interface to display and communicate data
  - UI Libraries for apt Representation (Chakra, Bootstrap)
  - Firebase, Firestore Integration and Authentication
  - Fetch API to combine results of our two networks.
  - Stored locally in a JSON Format.


Works Cited

https://www.hhs.gov/sites/default/files/health-worker-wellbeing-advisory.pdf 
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3743622/ 
https://link.springer.com/article/10.1186/s12889-021-10897-4 


Another potential use case is in ICUs for critical yet sustained Emergency Care. Burnout must not be a factor in life-threatening situations, and we aim to eliminate that with a creative implementation of the Twilio API. By auto scheduling and collecting data from calls, sending alerts for unforeseen shift changes, and recording case conversations among medical staff to maintain continuity in the course of treatment: there’s a ton of avenues we can impact! And we’ve learnt, through the endless Git commits and API calls we’ve made during Hacklytics ‘23, that data doesn’t need to be convoluted or overburdening. Like Twilio’s Serverless Prototyping, or Chakra's simplistic elegance in displaying our comprehensive data- Visual Feedback can speak for millions. 

