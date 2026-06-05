package com.example.project1_spring.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //autoincrement id value 1,2,accordance to insertion
    private Integer id;
    private String name;
    private String brand;
    private BigDecimal price;
    private String category;
    private String description;
   // @JsonFormat(shape =  JsonFormat.Shape.STRING,pattern="dd-MM-yyyy")//to do date foramt exact like htis wirte exact like this
    //comment it because now we are solving the date format in react
    private Date releasedate;
    private Boolean available;
    private Integer quantity;

    private String imagename;
    private String imagetype;
    @Lob
    private byte[] imagedata;

}
