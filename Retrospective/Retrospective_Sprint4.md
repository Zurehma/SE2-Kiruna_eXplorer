TEMPLATE FOR RETROSPECTIVE (Team 13)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
    - Committed: 5+6 (5 new stories, 6 stories from previous sprints that required updates as per stakeholder requests)
    - Done: 11
- Total points committed vs done 
    - Committed: 27 (13 points of previous sprint stories)
    - Done: 27
- Nr of hours planned vs spent (as a team)
    - Planned: 96h 15m
    - Spent: 96h 35m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   29    |    -    |   50h 55m  |    51h 10m   |
| _#KX1_ |    9    |   2     |    5h 20m  |     5h 40m   |
| _#KX6_ |    4    |   1     |    6h 30m  |      6h 30m  |
| _#KX9_ |    1    |   3     |    0h 45m  |     1h 00m   |
| _#KX19_ |  6     |   3     |    4h 45m  |    4h 15m    | 
| _#KX10_ |   8    |   3     |    8h 00m  |     8h 05m   |
| _#KX11_ |   1    |   1     |    0h 30m  |    0h 30m    |
| _#KX17_ |  7     |   3     |    4h 25m  |    4h 20m    |
| _#KX12_ |   5    |   5     |    4h 00m  |    4h 00m    |
| _#KX13_ |  6     |   2     |    4h 30m  |    4h 30m    |
| _#KX15_ |  5     |   2     |    4h 00m  |    3h 45m    |
| _#KX16_ |  4     |   2     |    2h 05m  |    2h 00m    |


   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
|------------|------|-------|
| Estimation |      |       | 
| Actual     |      |       |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 3h 30m
  - Total hours spent: 3h 30m
  - Nr of automated unit test cases: 
  - Coverage
- E2E testing:
  - Total hours estimated: 5h
  - Total hours spent: 5h
  - Nr of test cases: 
- Code review 
  - Total hours estimated: 2h 30m
  - Total hours spent: 2h 30m
- Technical Debt management:
  - Strategy adopted: 
    - We aimed to fix all issues that were giving a C rating in SonarQube.
    - We added more tasks for code review and code cleanup and allocated individual tasks for technical debt management in the sprint.
  - Total hours estimated estimated: 2h
  - Total hours spent: 2h
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We had aimed to refine the details of our application to improve functionality and make it more aesthetically pleasing. We were able to achieve this goal!
  
- Which ones you were not able to achieve? Why?
  - We were able to achieve the goals set out

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Propose one or two

- One thing you are proud of as a Team!!