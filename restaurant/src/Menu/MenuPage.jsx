import React from 'react';
import MenuItems from './MenuItems';
import MenuDiscoverMeals from './MenuDiscoverMeals';
import MenuReview from './MenuReview';
import AboutBooking from '../AboutComponents/AboutBooking';
export default function MenuPage(){
    return(
        <>
        <MenuItems />
        <MenuDiscoverMeals />
        <MenuReview />
        <AboutBooking />
        </>
    )
}