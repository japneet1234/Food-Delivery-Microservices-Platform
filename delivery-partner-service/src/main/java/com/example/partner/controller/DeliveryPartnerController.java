package com.example.partner.controller;

import com.example.partner.dto.CreatePartnerRequest;
import com.example.partner.dto.UpdateLocationRequest;
import com.example.partner.entity.DeliveryPartner;
import com.example.partner.service.DeliveryPartnerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/partners")
public class DeliveryPartnerController {

    private final DeliveryPartnerService service;

    public DeliveryPartnerController(DeliveryPartnerService service) {
        this.service = service;
    }

    @PostMapping
    public DeliveryPartner create(@RequestBody CreatePartnerRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}/location")
    public DeliveryPartner updateLocation(
            @PathVariable("id") Long id,
            @RequestBody UpdateLocationRequest req) {
        return service.updateLocation(id, req);
    }

    @PutMapping("/{id}/available")
    public DeliveryPartner markAvailable(@PathVariable("id") Long id) {
        return service.markAvailable(id);
    }

    @PutMapping("/{id}/busy")
    public DeliveryPartner markBusy(@PathVariable("id") Long id) {
        return service.markBusy(id);
    }
}
