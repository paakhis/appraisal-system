package com.appraisal.appraisal.service.impl;

import com.appraisal.appraisal.dtos.NotificationRequest;
import com.appraisal.appraisal.entity.Goal;
import com.appraisal.appraisal.entity.Review;
import com.appraisal.appraisal.entity.SelfEvaluation;
import com.appraisal.appraisal.entity.User;
//import com.appraisal.appraisal.service.EmailService;
import com.appraisal.appraisal.service.NotificationEventService;
import com.appraisal.appraisal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.appraisal.appraisal.repository.UserRepository;
import com.appraisal.appraisal.entity.enums.Roles;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationEventServiceImpl implements NotificationEventService {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventServiceImpl.class);

    private final NotificationService notificationService;
//    private final EmailService emailService;
    private final UserRepository userRepository;

    @Override
    public void goalAssigned(Goal goal) {
        User employee = goal.getUser();
        notify(employee, "New goal assigned",
                "A new goal \"" + goal.getTitle() + "\" has been assigned to you. Target date: " + goal.getTargetDate() + ".",
                "GOAL");
//        email(employee, "New goal assigned: " + goal.getTitle(),
//                "Hi " + safeName(employee) + ",\n\n" +
//                        "A new goal has been assigned to you:\n\n" +
//                        "Title: " + goal.getTitle() + "\n" +
//                        (goal.getDescription() != null ? "Description: " + goal.getDescription() + "\n" : "") +
//                        "Target date: " + goal.getTargetDate() + "\n\n" +
//                        "Please log in to the Appraisal Portal to review and acknowledge it.");
    }

    @Override
    public void goalApproved(Goal goal) {
        User employee = goal.getUser();
        notify(employee, "Goal approved",
                "Your goal \"" + goal.getTitle() + "\" has been approved.", "GOAL");
//        email(employee, "Goal approved: " + goal.getTitle(),
//                "Hi " + safeName(employee) + ",\n\nYour goal \"" + goal.getTitle() + "\" has been approved. Great work!");
    }

    @Override
    public void goalRejected(Goal goal) {
        User employee = goal.getUser();
        notify(employee, "Goal needs attention",
                "Your goal \"" + goal.getTitle() + "\" was rejected and needs revision.", "GOAL");
//        email(employee, "Goal rejected: " + goal.getTitle(),
//                "Hi " + safeName(employee) + ",\n\nYour goal \"" + goal.getTitle() + "\" was rejected by your manager and needs revision. " +
//                        "Please log in to the Appraisal Portal for details.");
    }

    @Override
    public void reviewFinalized(Review review) {
        User employee = review.getEmployee();
        String rating = review.getPerformanceRating() != null ? review.getPerformanceRating() + "/5" : "N/A";
        notify(employee, "Performance review finalized",
                "Your performance review has been finalized with a rating of " + rating + ".", "REVIEW");
//        email(employee, "Your performance review is finalized",
//                "Hi " + safeName(employee) + ",\n\n" +
//                        "Your performance review has been finalized.\n\n" +
//                        "Rating: " + rating + "\n" +
//                        (review.getComments() != null ? "Comments: " + review.getComments() + "\n" : "") +
//                        "\nPlease log in to the Appraisal Portal to view the full review.");
    }

    @Override
    public void selfEvaluationSubmitted(SelfEvaluation selfEvaluation) {
        User employee = selfEvaluation.getUser();
        User manager = employee.getManager();
        if (manager == null) {
            log.info("Employee {} has no manager assigned - skipping self-evaluation notification", employee.getId());
            return;
        }
        notify(manager, "Self-evaluation submitted",
                employee.getName() + " has submitted their self-evaluation for review.", "APPRAISAL");
//        email(manager, employee.getName() + " submitted a self-evaluation",
//                "Hi " + safeName(manager) + ",\n\n" +
//                        employee.getName() + " has submitted their self-evaluation for the current appraisal cycle.\n\n" +
//                        "Please log in to the Appraisal Portal to review it.");
    }

    @Override
    public void goalSubmitted(Goal goal) {

        User employee = goal.getUser();
        User manager = employee.getManager();

        if (manager == null) {
            return;
        }

        notify(
                manager,
                "Goal submitted",
                employee.getName() + " submitted goal \"" + goal.getTitle() + "\" for approval.",
                "GOAL"
        );

//        email(
//                manager,
//                "Goal submitted for approval",
//                "Hi " + safeName(manager) + ",\n\n"
//                        + employee.getName()
//                        + " has submitted the goal \""
//                        + goal.getTitle()
//                        + "\" for your approval."
//        );
    }
    @Override
    public void goalCompleted(Goal goal) {

        User employee = goal.getUser();
        User manager = employee.getManager();

        if (manager == null) {
            return;
        }

        notify(
                manager,
                "Goal completed",
                employee.getName() + " marked goal \"" + goal.getTitle() + "\" as completed.",
                "GOAL"
        );

//        email(
//                manager,
//                "Goal completed",
//                "Hi " + safeName(manager) + ",\n\n"
//                        + employee.getName()
//                        + " has completed the goal \""
//                        + goal.getTitle()
//                        + "\"."
//        );
    }
    @Override
    public void reviewSubmittedToHr(Review review) {

        List<User> hrUsers = userRepository.   findByRole(Roles.HR);

        if (hrUsers.isEmpty()) {
            return;
        }

        User manager = review.getManager();
        User employee = review.getEmployee();

        for (User hr : hrUsers) {

            notify(
                    hr,
                    "Review Submitted",
                    manager.getName()
                            + " submitted the review for "
                            + employee.getName(),
                    "REVIEW"
            );

//            email(
//                    hr,
//                    "Review Submitted",
//                    "Hi " + safeName(hr)
//                            + ",\n\nManager "
//                            + manager.getName()
//                            + " has submitted the performance review for "
//                            + employee.getName()
//                            + "."
//            );
        }
    }

    private void notify(User recipient, String title, String message, String type) {
        if (recipient == null) {
            return;
        }
        try {
            NotificationRequest request = new NotificationRequest(recipient.getId(), title, message, type);
            notificationService.sendNotification(request);
        } catch (Exception ex) {
            // A notification failure should never roll back the underlying business transaction.
            log.error("Failed to create in-app notification for user {}: {}", recipient.getId(), ex.getMessage());
        }
    }

//    private void email(User recipient, String subject, String body) {
//        if (recipient == null) {
//            return;
//        }
//        emailService.sendEmail(recipient.getEmail(), subject, body);
//    }

    private String safeName(User user) {
        return user != null && user.getName() != null ? user.getName() : "there";
    }
}
