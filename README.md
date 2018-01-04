Geoquery for Pebble Timeline
===================

Geoquery Pebble was an app designed to track school bus delays and cancelations from the Pebble Time watch. It is defunct.



The best way to track the school bus.
------



When a school bus is late, it can be a real pain. Many school boards provide a tool called Geoquery to try and fix this problem. But the solution isn't quite perfect. Geoquery has a poorly designed user interface and does not work well on phones, where parents and children need updates the most. We need to know if the bus will be late/cancelled when we are waiting outside for the bus. 

Pebble has been a revolution in infomartion and the smartwatch industry. This industry changing technology allows for easy access to information and with the new colour Pebble Time being released later this year(shipping for kickstarter backers this May 2015), and the Pebble Timeline Devlopers Challenge about to commence, this was the best time to create an application to a problem.

To top it all off, most schools across Canada use geoquery by Geroff Systems to track buses. While this software has been optimized for use with the Peel District School Board's STOPR Geoquery Bus Tracker it can be used for a variety of school boards. In fact, any school that provides an RSS Feed to track late buses, should be compatible. Continue to read on to find out how to modify the code and test it out. 

----------

Setting up for Modifications 
-------------

The best part of this is that the code can be used modified for use with any  **RSS FEED! THATS RIGHT ANY RSS FEED**

> **Note:**

> - The RSS XML feed must be written a certain way:
> - By default the app can process the item's `title`,`date`,`id`,and `summary`
> - This can be easily modified as many people use the `<description>` field in their XML file to give details **instead** of summary.
> - In additon, any other tags from compatible with XML  can be used. 
