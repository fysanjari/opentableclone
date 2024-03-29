import React from 'react';
import fullStar from "../../public/icons/full-star.png";
import halfStar from "../../public/icons/half-star.png";
import emptyStar from "../../public/icons/empty-star.png";
import Image from 'next/image';
import { Review } from '@prisma/client';
import { calculateReviewRatingAvg } from '../../utils/calculateReviewRatingAvg';

const Stars = ({ reviews }: { reviews: Review[] }) => {
  const rating = calculateReviewRatingAvg(reviews);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const difference = parseFloat((parseFloat(rating) - i).toFixed(1));
      if (difference > 0.6) {
        stars.push(fullStar);
      }
      else if (difference > 0) {
        stars.push(halfStar);
      }
      else {
        stars.push(emptyStar);
      }
    }

    return stars.map((star, index) => (
      <Image key={index} src={star} alt="" className="w-4 h-4 mr-1" />
    ));
  }
  return (
    <div className='flex items-center'>{renderStars()}</div>
  )
}

export default Stars;