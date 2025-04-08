
import React from 'react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Card, CardContent } from '@/components/ui/card';

const TextShimmerDemo = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Text Shimmer Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4 text-gray-500">Default Style</h3>
            <TextShimmer>This is the default text shimmer effect</TextShimmer>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4 text-gray-500">Blue Variant</h3>
            <TextShimmer
              duration={1.2}
              className="text-xl font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]"
            >
              Hi, how are you?
            </TextShimmer>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4 text-gray-500">Purple Variant</h3>
            <TextShimmer
              duration={1.5}
              className="text-2xl font-bold [--base-color:theme(colors.purple.600)] [--base-gradient-color:theme(colors.purple.300)] dark:[--base-color:theme(colors.purple.700)] dark:[--base-gradient-color:theme(colors.purple.400)]"
            >
              Premium Quality
            </TextShimmer>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4 text-gray-500">Heading with Custom Speed</h3>
            <TextShimmer
              as="h2"
              duration={3}
              spread={3}
              className="text-3xl font-extrabold [--base-color:theme(colors.gray.800)] [--base-gradient-color:theme(colors.gray.400)] dark:[--base-color:theme(colors.gray.200)] dark:[--base-gradient-color:theme(colors.gray.50)]"
            >
              Elegant Solutions
            </TextShimmer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TextShimmerDemo;
