"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Instagram, Mail } from "lucide-react";

export default function ContactPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-16">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground">
            We'd love to hear from you. Get in touch with us!
          </p>
        </div>

        {/* Contact Info */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Address */}

          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-sm text-muted-foreground">
                Bangalore, India
              </p>
            </CardContent>
          </Card>

          {/* Instagram */}

          <Card>
            <CardContent className="pt-6 text-center">
              <Instagram className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Instagram</h3>

              <a
                href="https://www.instagram.com/slaysundari"
                target="_blank"
                className="text-sm text-primary hover:underline"
              >
                @slaysundari
              </a>

            </CardContent>
          </Card>

          {/* Email */}

          <Card>
            <CardContent className="pt-6 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">
                slaysundari@gmail.com
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Contact Form */}

        <div className="max-w-2xl mx-auto">

          <Card>

            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>

            <CardContent>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Send Message
                </Button>

              </form>

            </CardContent>

          </Card>

        </div>

      </main>

      <Footer />

    </div>
  );
}