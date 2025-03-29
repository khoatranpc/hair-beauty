import React from 'react';
import { Skeleton, Divider } from 'antd';

const ProductDetailLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section Loading */}
        <div className="space-y-4">
          <Skeleton.Image active className="!w-full !h-[400px] rounded-lg" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton.Image
                key={index}
                active
                className="!w-full !h-20 rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Product Info Loading */}
        <div className="space-y-6">
          <Skeleton.Input active block className="!w-3/4 !h-10" />
          
          <div className="flex items-center space-x-4">
            <Skeleton.Input active className="!w-32" />
            <Skeleton.Input active className="!w-24" />
          </div>

          <Skeleton.Input active block className="!w-1/2 !h-8" />

          <Divider />

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton.Button active block className="!w-full !h-10" />
              <Skeleton.Button active block className="!w-full !h-10" />
            </div>
            <Skeleton.Input active className="!w-40" />
          </div>

          <Divider />

          <div className="space-y-4">
            <Skeleton.Input active block className="!w-40" />
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <Skeleton.Input
                  key={index}
                  active
                  block
                  className="!w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Loading */}
      <div className="mt-16">
        <Skeleton.Input active block className="!w-48 !mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton.Image active className="!w-full !h-48 rounded-lg" />
              <Skeleton.Input active block className="!w-full" />
              <Skeleton.Input active block className="!w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailLoading;