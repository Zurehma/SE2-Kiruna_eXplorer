# RETROSPECTIVE Sprint 1 (Team 13)

The retrospective should include _at least_ the following
sections:



- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)



## PROCESS MEASURES



### Macro statistics



- Number of stories committed vs. done
  - Committed: 4
  - Done: 4
- Total points committed vs. done
  - Committed: 9
  - Done: 9
- Nr of hours planned vs. spent (as a team)
  - Planned: 94h 20m 
  - Done: 94h 35m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed



> Please refine your DoD if required (you cannot remove items!)



### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_ | 26 | | 50h | 50h 35m |
| _KX1_ | 16 | 2 | 12h 30m | 13h 30m |
| _KX2_ | 16 | 3 | 11h 30m | 13h |
| _KX3_ | 6 | 1 | 5h | 4h 35m |
| _KX4_ | 17 | 3 | 13h 20m | 12h 55m |

> story `#0` is for technical tasks, leave out story points (not applicable in this case)



- Hours per task average, standard deviation (estimate and actual)
  - Estimated: 1h 09m
  - Actual: 1h 10m
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1
  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

  - (94h 35m)/(94h 20m) -1 = 0.002
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n
  
  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$
   - 0.048

## QUALITY MEASURES



- Unit Testing:
  - Total hours estimated: 15h 30m
  - Total hours spent: 15h 30m
  - Nr of automated unit test cases: 75
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: 2h 30m
  - Total hours spent: 2h 30m
- Code review
  - Total hours estimated: 3h
  - Total hours spent: 3h





## ASSESSMENT



- What caused your errors in estimation (if any)?
  - We did a small error in assigning hours to tasks where some tasks were overestimated while some were underestimated. However, the overall estimations were pretty balanced. 

- What lessons did you learn (both positive and negative) in this sprint?
  - We learned that we need to do more manual testing to prevent issues coming up at the end.
  - We learned that we need to communicate a bit more between the frontend and backend teams to ensure coherency in the development process.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - We had planned to have 2-3 meetings over the course of the sprint in the form of scrum meetings. We were able to have 4 of them which really helped with the workflow.
  - We set up internal deadlines to help achieve the goals on time
  - Everybody better understood and followed the workflow of the application and of git management.
- Which ones you were not able to achieve? Why?
  - We were able to achieve all of the improvement goals set out.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - More strict internal deadlines for delivering of APIs etc. to further improve coherency in workflow
  - One-to-one meetings between backend and frontend developers to understand formats and details of APIs and code


  > Propose one or two

- One thing you are proud of as a Team!!
  - We were able to deliver all of the committed stories completed and working
