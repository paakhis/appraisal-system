package com.appraisal.appraisal.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDistributionEntry {
    private int rating; // 1-5
    private long count;
}
