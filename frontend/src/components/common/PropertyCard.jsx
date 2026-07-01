import React from "react";
import { propertyCardStyles as s } from "../../assets/dummyStyles";
import { useAuth } from '../../context/AuthContext'

const PropertyCard = ({
    property,
    renderActions,
    isWishlisted,
    onToggleWishlist
}) => {
 if(!property) return null;



const {user} = useAuth();
const
    return (
        <div>

        </div>
    )
}

export default PropertyCard