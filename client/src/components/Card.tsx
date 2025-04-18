import { Bath, Bed, Edit, Heart, House, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const getStatusColor = (status: PropertyStatus) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Rented':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'UnderMaintenance':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Inactive':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
  isManager = false,
  onDelete,
  onEdit,
}: CardProps) => {
  // Use images field if available, otherwise fallback to photoUrls
  const propertyImages = property.images?.length
    ? property.images
    : property.photoUrls;
  const [imgSrc, setImgSrc] = useState(
    propertyImages?.[0] || '/placeholder.jpg'
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(property.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(property.id);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full mb-5">
      <div className="relative">
        <div className="w-full h-48 relative">
          <Image
            src={imgSrc}
            alt={property.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc('/placeholder.jpg')}
          />
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {property.isPetsAllowed && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
              Parking Included
            </span>
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {showFavoriteButton && (
            <button
              className="bg-white hover:bg-white/90 rounded-full p-2 cursor-pointer"
              onClick={onFavoriteToggle}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          )}
          {isManager && onEdit && (
            <button
              className="bg-white hover:bg-blue-100 rounded-full p-2 cursor-pointer"
              onClick={handleEdit}
              title="Edit property"
            >
              <Edit className="w-5 h-5 text-blue-500" />
            </button>
          )}
          {isManager && onDelete && (
            <button
              className="bg-white hover:bg-red-100 rounded-full p-2 cursor-pointer"
              onClick={handleDelete}
              title="Delete property"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">
            {propertyLink ? (
              <Link
                href={propertyLink}
                className="hover:underline hover:text-blue-600"
                scroll={false}
              >
                {property.name}
              </Link>
            ) : (
              property.name
            )}
          </h2>
          {property.status && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                property.status
              )}`}
            >
              {property.status}
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-2">
          {property?.location?.address}, {property?.location?.city}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-1">
              ({property.numberOfReviews} Reviews)
            </span>
          </div>
          <p className="text-lg font-bold mb-3">
            ${property.pricePerMonth.toFixed(0)}{' '}
            <span className="text-gray-600 text-base font-normal"> /month</span>
          </p>
        </div>
        <hr />
        <div className="flex justify-between items-center gap-4 text-gray-600 mt-5">
          <span className="flex items-center">
            <Bed className="w-5 h-5 mr-2" />
            {property.beds} Bed
          </span>
          <span className="flex items-center">
            <Bath className="w-5 h-5 mr-2" />
            {property.baths} Bath
          </span>
          <span className="flex items-center">
            <House className="w-5 h-5 mr-2" />
            {property.squareFeet} sq ft
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
